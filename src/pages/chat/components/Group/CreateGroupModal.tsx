import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CheckCircle, MagnifyingGlass, Placeholder, Plus, PlusCircle, SpinnerGap, User, UsersThree, X, XCircle } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@xmtp/browser-sdk";
import React, { useRef, useState } from 'react';

interface User {
  name: string;
  address: string;
  pfp: string;
  canMessage?: boolean;
}

interface ConversationsProps {
  client: Client | null;
}

const CreateGroupModal = ({ client }: ConversationsProps) => {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();


  const [isMakingNewGroup, setIsMakingNewGroup] = useState(false);
  const [showDiv2, setShowDiv2] = useState(false);
  const [isGroupDescriptionExpanded, setIsGroupDescriptionExpanded] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [showPopover, setShowPopover] = useState(false);

  const [loadingCanMessageCheck, setLoadingCanMessageCheck] = useState<string[]>([]);
  const [loadingCreatingGroup, setLoadingCreatingGroup] = useState(false);


  const handleMakeNewGroup = () => {
    setIsMakingNewGroup(true);
  }

  const handleInputChange = () => {
    if (groupDescriptionRef.current) {
      groupDescriptionRef.current.style.height = "auto";
      groupDescriptionRef.current.style.height = `${groupDescriptionRef.current.scrollHeight}px`;
      setIsGroupDescriptionExpanded(groupDescriptionRef.current.scrollHeight > 40);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (groupDescriptionRef.current) groupDescriptionRef.current.value = "";
      handleInputChange();
    }
  }

  const handleSelectMember = async (user: User) => {
    // Add user to loading state
    setLoadingCanMessageCheck((prev) => [...prev, user.address]);
  
    const canMessageMap = await client?.canMessage([user.address]);
    const canMessage = canMessageMap?.get(user.address?.trim()?.toLowerCase()) || false;
  
    // Update selected members
    setSelectedMembers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((selectedUser) => selectedUser.address === user.address)) {
        // If the user is already selected, remove them
        return prevSelectedUsers.filter((selectedUser) => selectedUser.address !== user.address);
      } else {
        // Add the user with the canMessage key
        return [...prevSelectedUsers, { ...user, canMessage }];
      }
    });
  
    // Remove user from loading state
    setLoadingCanMessageCheck((prev) => prev.filter((addr) => addr !== user.address));
  };
  

  const handleCreateGroup = async () => {
    if (groupNameRef.current && groupDescriptionRef.current) {
      setLoadingCreatingGroup(true);
      const groupName = groupNameRef.current.value;
      const groupDescription = groupDescriptionRef.current.value;

      const memberAddresses = selectedMembers?.filter((user) => user?.canMessage)?.map(member => member.address);

      await client?.conversations?.newGroup(memberAddresses, {
        name: groupName,
        description: groupDescription,
      })
      queryClient.invalidateQueries(['conversations'] as any);
      
      setLoadingCreatingGroup(false);
      setShowPopover(false);
      setSelectedMembers([]);
      groupNameRef.current!.value = "";
      groupDescriptionRef.current!.value = "";
      setShowDiv2(false);
      setIsMakingNewGroup(false);
    }
  }

  return (
    <div>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild><button onClick={() => setShowPopover((prev) => !prev)} className="bg-white4 rounded-md p-2"><Plus size={18} weight="bold" className="text-white88"/></button></PopoverTrigger>
        <PopoverContent className="bg-black90 border border-white12 min-w-[150px] mx-2 mr-3 w-[95vw] md:w-[400px] p-0 overflow-hidden relative h-full">

          <div onClick={handleMakeNewGroup} className={`${isMakingNewGroup ? "hidden" : "block"} text-white88 text-[14px] flex items-center gap-2 hover:bg-black70 cursor-pointer p-2`}><UsersThree size={18}/> New Group</div>

          <div className={`${isMakingNewGroup ? "block" : "hidden"} py-2 size-full`}>
            {/* Div 1 */}
            <div className={`inset-0 text-white flex items-center justify-center transition-transform duration-500 ${isMakingNewGroup && showDiv2 ? "-translate-x-full" : "translate-x-0"}`}>
              <div className="text-center size-full">
                <div className="flex justify-between items-center px-2">
                  <ArrowLeft onClick={() => {setIsMakingNewGroup(false); setSelectedMembers([])}} className="text-white64"/>
                  <div className="text-white88 text-[14px]">Add Members</div>
                  <button disabled={selectedMembers?.length == 0} onClick={() => setShowDiv2(true)} className={`${!selectedMembers?.length ? "text-white48 cursor-not-allowed" : "text-white88 hover:text-white64"} text-[14px]`}>next</button>
                </div>

                <div className="mt-4">
                  <div className="bg-black70 flex items-center rounded-full mx-2 px-2">
                    <MagnifyingGlass className="text-white64"/>
                    <input type="text" placeholder="wallet address..." className="w-full bg-transparent text-white88 p-2 rounded-md placeholder:text-white32 outline-none border-none"/>
                  </div>

                  <div className="mt-4">
                    <p className="flex items-start px-2 text-white88">Users</p>
                    <div className="border-b border-white7 my-1 mx-2"/>
                    <div className="max-h-[500px] overflow-y-auto">
                      {dummyUsers.map((user) => (
                        <div onClick={() => handleSelectMember(user)} key={user.address} className="flex items-center gap-1 hover:bg-white4 transition duration-200 rounded-md cursor-pointer py-1 px-2">
                          <div className="bg-white7 p-2 rounded-full">
                            <User className="text-white64" size={18} />
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex flex-col items-start">
                              <p className="text-[14px] text-white88">{user?.name}</p>
                              <p className="text-[12px] text-white48">{user?.address?.slice(0, 5) + "..." + user?.address?.slice(-5)}</p>
                            </div>
                            <div>
                              {loadingCanMessageCheck?.includes(user.address) ? (
                                    <SpinnerGap className="text-gray-500 animate-spin" />
                                ) :
                                selectedMembers.some((selectedUser) => selectedUser?.address === user?.address) ? (
                                selectedMembers.some((selectedUser) => selectedUser?.address === user?.address && !selectedUser?.canMessage) ? (
                                  <div className="flex flex-col items-end">
                                    <XCircle weight="fill" size={20} className="text-red-500" />
                                    <p className="text-[8px] text-red-500">Not on Network</p>
                                  </div>
                                ) : (
                                  <CheckCircle weight="fill" size={20} className="text-greenText" />
                                )
                              ) : (
                                <PlusCircle weight="fill" size={20} className="text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Div 2 */}
              <div
                className={`absolute inset-0 text-white transition-transform duration-500 ${
                  isMakingNewGroup && showDiv2 ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="p-2 w-full">
                  <div className="flex justify-between items-center">
                    <p onClick={() => setShowDiv2(false)} className="text-white64 text-[14px] cursor-pointer hover:text-white48">Back</p>
                    <div className="text-white88 text-[14px]">New group</div>
                    {loadingCreatingGroup ? <SpinnerGap className="text-gray-500 animate-spin"/> : <button disabled={!selectedMembers.length || loadingCreatingGroup} onClick={() => handleCreateGroup()} className={`${!selectedMembers?.length ? "text-white48 cursor-not-allowed" : "text-white88 hover:text-white64"} text-[14px]`}>create</button>}
                  </div>

                  <div className="bg-black60 rounded-md py-2 px-2 flex items-center gap-2 w-full mt-4">
                    <div className="min-w-12 min-h-12 rounded-full bg-black90 flex justify-center items-center"><Placeholder className='size-[80%] text-white48'/></div>
                    <div className="w-full">
                      <input autoFocus ref={groupNameRef} placeholder="group name" className="bg-transparent border-b border-white7 w-full text-white88 px-2 py-1 outline-none placeholder:text-white32"/>
                    </div>
                  </div>

                  <div className="bg-black60 rounded-md h-auto py-2 px-2 flex flex-col gap-2 w-full mt-2">
                    <p className="text-white88 px-2">Description</p>
                    <div className={`w-full flex items-center relative bg-black70 transition duration-300 ${isGroupDescriptionExpanded ? "rounded-md" : " rounded-full"}`}>
                      <textarea
                        ref={groupDescriptionRef}
                        className={`w-full px-3 py-2 text-sm outline-none resize-none overflow-hidden bg-transparent transition duration-300 placeholder:text-white32 ${
                          isGroupDescriptionExpanded ? "rounded-md" : "rounded-full"
                        }`}
                        placeholder="this group is awesome"
                        onInput={handleInputChange}
                        onKeyDown={handleKeyDown}
                        rows={1}
                      />
                    </div>
                  </div>

                  <div className="bg-black60 rounded-md h-auto py-2 px-2 flex flex-col gap-2 w-full mt-2">
                    <p className="text-white88 px-2">Selected Members</p>
                    <div className="grid grid-cols-4 gap-2 place-items-center pt-1 max-h-[550px] overflow-y-auto">
                      {!selectedMembers?.length ? <div className="text-[12px] px-2 text-white32">No members selected</div> : selectedMembers?.filter((user) => user?.canMessage)?.map((user) => (
                        <div onClick={() => handleSelectMember(user)} key={user.address} className="flex flex-col justify-center items-center gap-2 py-1 px-2 border border-white12 w-20 rounded-md relative cursor-pointer hover:bg-white4 col-span-1">
                          <div className="absolute -top-[6px] -right-[6px] bg-white32 rounded-full p-[2px] cursor-pointer"><X size={10} weight="bold" className="text-white"/></div>
                          <div className="bg-white7 p-2 rounded-full">
                            <User className="text-white64" size={18} />
                          </div>
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-[13px] text-white88 truncate w-20 text-center">{user?.name?.length > 6 ? user?.name?.slice(0, 8) : user?.name}</p>
                            <p className="text-[12px] text-white48">{user?.address?.slice(0, 4) + "..." + user?.address?.slice(-4)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
          </div>

        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CreateGroupModal

const dummyUsers = [
  {name: "Ak", address: "0xb879f1d8FD73EC057c02D681880169e5721a6d7F", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_2", address: "0x7ad9d3892D5EEC0586920D3E0ac813aaeF881488", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_3", address: "0x73655B77df59d378d396918C3426cc5219EfB3c8", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_577777777", address: "0x5aB557A6b8FF7D7a9A42F223fAA376A4732Eb15a", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_6", address: "0x38F966794cf349f2c91116e94f587Fc3aafDC3F4", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_7", address: "0xa823E89EBA816056454EEbDa03452004350CCb40", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_8", address: "0xfF3eA61352e8591105A06cCBE28c85762d3d1962", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_9", address: "0xe87c84C8328fad0337792855f0BE60d7c7B7E6c9", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_10", address: "0xb6Ca36C90E5851Aa9E109868739DAf2EEeF74A0E", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_11", address: "0x17b8bA0fe26332cF18a18561e59C3624E276D0fF", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_12", address: "0x7DE14e5b6FDAF3e0f265e50f25216EDd412307e0", pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak acc_13", address: "0x6A0d25901da9A04a56aE54996F60D7B5493Dac27", pfp: "https://randomuser.me/api/portraits"},
]