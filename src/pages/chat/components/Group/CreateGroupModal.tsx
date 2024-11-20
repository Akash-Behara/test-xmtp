import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, MagnifyingGlass, Placeholder, Plus, UsersThree } from "@phosphor-icons/react";
import React, { useRef, useState } from 'react';


const CreateGroupModal = () => {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const [isMakingNewGroup, setIsMakingNewGroup] = useState(false);
  const [showDiv2, setShowDiv2] = useState(false);
  const [isGroupDescriptionExpanded, setIsGroupDescriptionExpanded] = useState(false);

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

  // useEffect(() => {
  //   if(!groupNameRef?.current) return
  //   setTimeout(() => {
  //     groupNameRef?.current?.focus();
  //   }, 500);
  // }, [groupNameRef, showDiv2])

  return (
    <div>
      <Popover>
        <PopoverTrigger><div className="bg-white4 rounded-md p-2"><Plus size={18} weight="bold" className="text-white88"/></div></PopoverTrigger>
        <PopoverContent className="bg-black90 border border-white12 min-w-[150px] mx-2 mr-3 w-[95vw] md:w-[400px] p-0 overflow-hidden relative h-full">

          <div onClick={handleMakeNewGroup} className={`${isMakingNewGroup ? "hidden" : "block"} text-white88 text-[14px] flex items-center gap-2 hover:bg-black70 cursor-pointer p-2`}><UsersThree size={18}/> New Group</div>

          <div className={`${isMakingNewGroup ? "block" : "hidden"} py-2 size-full`}>
            {/* Div 1 */}
            <div className={`inset-0 text-white flex items-center justify-center transition-transform duration-500 ${isMakingNewGroup && showDiv2 ? "-translate-x-full" : "translate-x-0"}`}>
              <div className="text-center size-full px-2">
                <div className="flex justify-between items-center">
                  <ArrowLeft onClick={() => setIsMakingNewGroup(false)} className="text-white64"/>
                  <div className="text-white88 text-[14px]">Add Members</div>
                  <div onClick={() => setShowDiv2(true)} className="text-white88 text-[14px] cursor-pointer hover:text-white64">next</div>
                </div>

                <div className="mt-4">
                  <div className="bg-black70 flex items-center rounded-full px-2">
                    <MagnifyingGlass className="text-white64"/>
                    <input type="text" placeholder="wallet address..." className="w-full bg-transparent text-white88 p-2 rounded-md placeholder:text-white32 outline-none border-none"/>
                  </div>

                  <div className="mt-4">
                    <div className="max-h-[500px] overflow-y-auto">
                      {dummyUsers.map((user) => (
                        <div key={user.name} className="flex justify-between items-center gap-2 p-2 hover:bg-white/10 rounded-sm cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="bg-white/30 rounded-full p-2">
                              <UsersThree color="#000" weight="fill" size={24}/>
                            </div>
                            <div className="">
                              <p className="font-semibold text-white text-[14px]">{user.name}</p>
                              <p className="font-semibold text-white/60 text-[10px]">{user.address}</p>
                            </div>
                          </div>

                          <div>
                            <div className="bg-greenText rounded-full w-4 h-4 p-2 text-[10px] flex justify-center items-center">+</div>
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
                className={`absolute inset-0 text-white transition-transform duration-500  ${
                  isMakingNewGroup && showDiv2 ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="p-2 w-full">
                  <div className="flex justify-between items-center">
                    <p onClick={() => setShowDiv2(false)} className="text-white64 text-[14px] cursor-pointer hover:text-white48">Back</p>
                    <div className="text-white88 text-[14px]">New group</div>
                    <div onClick={() => setShowDiv2(true)} className="text-white88 text-[14px] cursor-pointer hover:text-white64">create</div>
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
    {name: "John Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
    {name: "Jane Doe", address: "0x123456789", pfp: "https://randomuser.me/api/portraits"},
  ]