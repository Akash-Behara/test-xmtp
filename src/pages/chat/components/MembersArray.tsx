import FallbackImage from '@/components/fallbacks/FallbackImage';
import { CheckCircle, PlusCircle, SpinnerGap, User, X, XCircle } from '@phosphor-icons/react';
import { Client } from '@xmtp/browser-sdk';
import { useState } from 'react';
import { CustomUserSafeGroupMember } from '../utils/types';



interface MembersArrayProps {
  client: Client | null;
  users?: CustomUserSafeGroupMember[];
  selectedMembers: CustomUserSafeGroupMember[];
  showDiv2?: boolean;
  isRemovingMembers?: boolean;
  setSelectedMembers: React.Dispatch<React.SetStateAction<CustomUserSafeGroupMember[]>>;
}

const MembersArray = ({ client, users, selectedMembers, showDiv2 = false, isRemovingMembers = false, setSelectedMembers }: MembersArrayProps) => {

  const [loadingCanMessageCheck, setLoadingCanMessageCheck] = useState<string[]>([]);

  const handleSelectMember = async (user: CustomUserSafeGroupMember) => {
    console.log('user:', user);

    if(isRemovingMembers){
      setLoadingCanMessageCheck((prev) => [...prev, user.accountAddresses[0]?.trim()?.toLowerCase()]);

      setSelectedMembers((prevSelectedUsers) => {
        if (prevSelectedUsers.some((selectedUser) => selectedUser.accountAddresses[0] === user.accountAddresses[0])) {
          // If the user is already selected, remove them
          return prevSelectedUsers.filter((selectedUser) => selectedUser.accountAddresses[0] !== user.accountAddresses[0]);
        } else {
          // Add the user with the canMessage key
          return [...prevSelectedUsers, { ...user }];
        }
      });
      setLoadingCanMessageCheck((prev) => prev.filter((addr) => addr !== user.accountAddresses[0]?.trim()?.toLowerCase()));
      return
    }

    // Add user to loading state
    setLoadingCanMessageCheck((prev) => [...prev, user.accountAddresses[0]?.trim()?.toLowerCase()]);
  
    const canMessageMap = await client?.canMessage([user.accountAddresses[0]]);
    const canMessage = canMessageMap?.get(user.accountAddresses[0]?.trim()?.toLowerCase()) || false;

    // Update selected members
    setSelectedMembers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((selectedUser) => selectedUser.accountAddresses[0] === user.accountAddresses[0])) {
        // If the user is already selected, remove them
        return prevSelectedUsers.filter((selectedUser) => selectedUser.accountAddresses[0] !== user.accountAddresses[0]);
      } else {
        // Add the user with the canMessage key
        return [...prevSelectedUsers, { ...user, canMessage }];
      }
    });
  
    // Remove user from loading state
    setLoadingCanMessageCheck((prev) => prev.filter((addr) => addr !== user.accountAddresses[0]?.trim()?.toLowerCase()));
  };

  console.log('selectedMembers:', selectedMembers);

  console.log('users:', users);

  if(showDiv2) {
    return (
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
                <p className="text-[13px] text-white88 truncate w-20 text-center">{user?.name ? user?.name?.length! > 6 ? user?.name?.slice(0, 8) : user?.name : user?.accountAddresses[0]}</p>
                <p className="text-[12px] text-white48">{user?.address ? user?.address?.slice(0, 4) + "..." + user?.address?.slice(-4) : user?.accountAddresses[0]?.slice(0, 4) + "..." + user?.accountAddresses[0]?.slice(-4)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="max-h-dvh md:max-h-[650px] overflow-y-auto">
        {users?.map((user) => (
        <div onClick={() => handleSelectMember(user)} key={user.inboxId} className="flex items-center gap-1 hover:bg-white4 transition duration-200 rounded-md cursor-pointer py-1 px-2">
          <div className="bg-white7 p-2 rounded-full min-w-10 min-h-10">
            <FallbackImage name={user?.inboxId}/>
          </div>
          <div className="flex justify-between items-center w-full">
          <div className="flex flex-col items-start">
            <p className="text-[14px] text-white88">{user?.name ? user?.name?.length! > 6 ? user?.name?.slice(0, 8) : user?.name : user?.accountAddresses[0]}</p>
            <p className="text-[12px] text-white48">{user?.address ? user?.address?.slice(0, 4) + "..." + user?.address?.slice(-4) : user?.accountAddresses[0]?.slice(0, 4) + "..." + user?.accountAddresses[0]?.slice(-4)}</p>
          </div>
          {isRemovingMembers ? (
            <div>
            {loadingCanMessageCheck?.includes(user.accountAddresses[0]?.trim()?.toLowerCase()) ? (
              <SpinnerGap className="text-gray-500 animate-spin" />
            ) :
              selectedMembers.some((selectedUser) => selectedUser?.accountAddresses[0] === user?.accountAddresses[0]) ? (
              <CheckCircle weight="fill" size={20} className="text-greenText" />
            ) : (
              <PlusCircle weight="fill" size={20} className="text-blue-500" />
            )}
          </div>
          ) : ( 
          <div>
            {loadingCanMessageCheck?.includes(user.accountAddresses[0]?.trim()?.toLowerCase()) ? (
              <SpinnerGap className="text-gray-500 animate-spin" />
            ) :
              selectedMembers.some((selectedUser) => selectedUser?.accountAddresses[0] === user?.accountAddresses[0]) ? (
              selectedMembers.some((selectedUser) => selectedUser?.accountAddresses[0] === user?.accountAddresses[0] && !selectedUser?.canMessage) ? (
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
          )}
          </div>
        </div>
        ))}
      </div>
    </div>
  )


}

export default MembersArray
