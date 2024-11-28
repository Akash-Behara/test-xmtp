import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, MagnifyingGlass, Placeholder, Plus, SpinnerGap, UsersThree } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { Client, PermissionLevel } from "@xmtp/browser-sdk";
import React, { useRef, useState } from 'react';
import { CustomUserSafeGroupMember } from "../../utils/types";
import MembersArray from "../MembersArray";


interface ConversationsProps {
  client: Client | null;
  conversationList: any;
  handleSelectConversation: (conversation: any) => void;
}

const CreateGroupModal = ({ client, conversationList, handleSelectConversation }: ConversationsProps) => {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const [isMakingNewGroup, setIsMakingNewGroup] = useState(false);
  const [showDiv2, setShowDiv2] = useState(false);
  const [isGroupDescriptionExpanded, setIsGroupDescriptionExpanded] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState<CustomUserSafeGroupMember[]>([]);
  const [showPopover, setShowPopover] = useState(false);

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

  const handleCreateGroup = async () => {
    if (groupNameRef.current && groupDescriptionRef.current) {
      setLoadingCreatingGroup(true);
      const groupName = groupNameRef.current.value;
      const groupDescription = groupDescriptionRef.current.value;

      const memberAddresses: string[] = selectedMembers
      ?.filter((user) => user?.canMessage)
      .map((member) => member.address)
      .filter((address): address is string => !!address);

      await client?.conversations?.newGroup(memberAddresses, {
        name: groupName,
        description: groupDescription,
      });

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

  // const {data: conversationList, isLoading: isLoadingConversations} = useQuery({
  //   queryKey: ["conversations"],
  //   queryFn: async () => await client!.conversations.list(),
  //   enabled: client != null
  // })

  const handleStartOneonOneConversation = async (address: string) => {
    const existingConvo = conversationList?.find((convo: any) => 
      convo.mem.some((member: any) => member.accountAddresses.includes(address?.trim()?.toLowerCase()))
    );
  
    if (existingConvo) {
      handleSelectConversation(existingConvo);
      setShowPopover(false);
      return;
    }
  
    // Create a new 1:1 conversation if none exists
    const convo = await client!.conversations.newDm(address);
    console.log("new 1:1 conversation:", convo);
    queryClient.invalidateQueries(["conversations"] as any);
    handleSelectConversation(convo);
    setShowPopover(false);
  };
  
  // console.log('conversationList:', conversationList);
  
  return (
    <div>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild><button onClick={() => {setShowPopover((prev) => !prev); setIsMakingNewGroup(false)}} className="bg-white4 rounded-md p-2"><Plus size={18} weight="bold" className="text-white88"/></button></PopoverTrigger>
        <PopoverContent className="bg-black90 border border-white12 min-w-[150px] mx-2 mr-3 w-[95vw] md:w-[400px] p-0 overflow-hidden relative h-full">

          <div onClick={handleMakeNewGroup} className={`${isMakingNewGroup ? "hidden" : "block"} text-white88 text-[14px] flex items-center gap-2 hover:bg-black70 cursor-pointer p-2 mt-1`}><UsersThree size={22} weight="fill"/> New Group</div>
          <div className="h-[1px] w-[98%] bg-black40 my-1 mx-auto"/>

          {!isMakingNewGroup &&
          <div className="">
            <div className="p-2">
              <p className="text-white88 text-[14px]">Users</p>
            </div>

            <div className="h-[1px] w-[98%] bg-black40 my-1 mx-auto"/>

            <div className="">
              {dummyUsers.map((user) => (
                <div key={user?.address} onClick={() => {handleStartOneonOneConversation(user?.accountAddresses[0])}} className="flex items-center gap-1 mb-2 hover:bg-white7 rounded-sm cursor-pointer py-2 px-2">
                  <div className="h-10 w-10 bg-white32 rounded-full"/>
                  <div className="flex flex-col">
                    <p className="text-white64 text-[14px]"> {user?.name}</p>
                    <p className="text-white32 text-[12px]">{user?.accountAddresses[0]?.slice(0,5) + "..." + user?.accountAddresses[0]?.slice(-5)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          }

          <div className={`${isMakingNewGroup ? "block" : "hidden"} py-2 size-full h-[80vh] md:h-[650px]`}>
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

                  <div>
                    <MembersArray users={dummyUsers} client={client} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} showDiv2={showDiv2}/>
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

                  <MembersArray users={dummyUsers} client={client} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} showDiv2={showDiv2}/>

                </div>
              </div>
          </div>

        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CreateGroupModal

const dummyUsers: CustomUserSafeGroupMember[] = [
  {name: "Ak BRAVE", address: "0xb879f1d8FD73EC057c02D681880169e5721a6d7F", accountAddresses:['0xb879f1d8FD73EC057c02D681880169e5721a6d7F'], canMessage: true, consentState: 1, inboxId: "1ea988ca835c1cc70d35524af40a83c448223a19e3ec931888b115964f585adc", installationIds: ['x:76ded41ba7dc789475c7d21b2c49fafab446849f'], permissionLevel: PermissionLevel.Member, pfp: "https://randomuser.me/api/portraits"},
  {name: "Ak", address: "0x0e3E591cdA42517D6DEd61D9DC3165AdDD179a8d", pfp: "https://randomuser.me/api/portraits", accountAddresses:['0x0e3E591cdA42517D6DEd61D9DC3165AdDD179a8d'], canMessage: true, consentState: 1, inboxId: "d419f05022dc79deedab681642127c046858cfba480525c7cde5160bf64d4f33", installationIds: ["x:4926fbdb8e59dc7141e43722373841a65ea6930b"], permissionLevel: PermissionLevel.SuperAdmin},
  // {name: "BOT", address: "0x4B901D50c5E33787759281eb8B7A3fFf165BA5e7", pfp: "https://randomuser.me/api/portraits", accountAddresses:['0x4B901D50c5E33787759281eb8B7A3fFf165BA5e7'], canMessage: true, consentState: 1, inboxId: "d419f05022dc79deedab681642127c046858cfba480525c7cde5160bf64d4f33", installationIds: ["x:4926fbdb8e59dc7141e43722373841a65ea6930b"], permissionLevel: PermissionLevel.SuperAdmin},
]