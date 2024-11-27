
import FallbackImage from "@/components/fallbacks/FallbackImage"
import {
  DialogClose,
  DialogContent
} from "@/components/ui/dialog"
import { NotePencil, SpinnerGap, Trash, X } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { Client, Conversation } from "@xmtp/browser-sdk"
import { useRef, useState } from "react"
import { CustomUserSafeGroupMember } from "../../utils/types"
import MembersArray from "../MembersArray"
import TextInputArea from "../ui/TextInputArea"

interface GroupInfoModalProps {
  client: Client | null
  groupDetails?: Conversation
  members?: CustomUserSafeGroupMember[]
}

const GroupInfoModal = ({ client, groupDetails, members }: GroupInfoModalProps) => {

  const groupNameRef = useRef<HTMLTextAreaElement>(null)
  const groupDescriptionRef = useRef<HTMLTextAreaElement>(null)

  const [isEdtingGroupInfo, setIsEditingGroupInfo] = useState(false)
  const [isEditingMembers, setIsEditingMembers] = useState(false)

  const [selectedMembers, setSelectedMembers] = useState<any>([])

  const [isLoading, setIsLoading] = useState(false)

  const {refetch: refetchGroup} = useQuery({
    queryKey: ["conversations"]
  })

  const handleEditGroupInfo = async () => {
    setIsLoading(true)
    await groupDetails?.updateName(groupNameRef.current?.value!)
    await groupDetails?.updateDescription(groupDescriptionRef.current?.value!)
    refetchGroup()
    setIsLoading(false)
    setIsEditingGroupInfo(false)
  }

  const handleCloseModal = () => {
    setIsEditingGroupInfo(false)
    setIsEditingMembers(false)
  }

  const removeMembers = async () => {
    const memberAddresses: string[] = selectedMembers
    await groupDetails?.removeMembers(memberAddresses)
  }

  return (
    <DialogContent className="bg-black90 border border-white7 p-2 md:p-3 w-[95%] md:w-full">
       <DialogClose className="flex justify-end">
        <p className="absolute left-1/2 transform -translate-x-1/2 text-white88 transition duration-200">{isEdtingGroupInfo ? "Edit info" : "Info"}</p>
        <X className="h-4 w-4 text-white64 hover:text-white" onClick={handleCloseModal}/>
       </DialogClose>

      <div className="flex flex-col justify-center items-center relative overflow-hidden h-full">
        {/* Header */}
        <div className="relative flex items-center w-full mt-[2px]">
          <button
            onClick={() => setIsEditingGroupInfo(!isEdtingGroupInfo)}
            className="ml-auto text-white64 bg-white32 px-[2px] py-[2px] rounded-sm text-[14px] font-semibold hover:bg-white48"
          >
            <NotePencil className="h-5 w-5"/>
          </button>
        </div>

        {/* Group Details */}
        <div className="">
          {groupDetails?.imageUrl ? (
            <img
              src={groupDetails.imageUrl}
              alt="Group"
              className="w-20 h-20 rounded-full"
            />
            ) : (
            <div className="w-20 h-20 bg-white7 rounded-full flex justify-center items-center capitalize text-white text-xl">
              <FallbackImage name={groupDetails?.name} />
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col justify-center items-center">
          <div className="text-white88 font-semibold">{groupDetails?.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white64 text-[14px]">Group</p>
            <div className="size-1 bg-white48 rounded-full" />
            <div className="text-white64 text-[14px]">{members?.length} members</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-black60 w-full rounded-md mt-4 p-2">
          <p className="text-white64 font-semibold">Description</p>
          <p className="text-white88 text-[14px] mt-2">{groupDetails?.description}</p>
        </div>

        {/* Members */}
        <div className="bg-black60 w-full rounded-md mt-4 p-2">
          <div className="flex justify-between items-center">
            <p className="text-white64 font-semibold">Members</p>
            <button
              onClick={() => setIsEditingMembers((prev) => !prev)}
              className="ml-auto text-white64 bg-white32 px-[2px] py-[2px] rounded-sm text-[14px] font-semibold hover:bg-white48"
            >
              <NotePencil className="h-4 w-4"/>
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
            {members?.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white7 rounded-full flex justify-center items-center"></div>
                <p className="text-white88 text-[14px]">{member?.accountAddresses}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit group Info Section */}
        <div className={`absolute bottom-0 left-0 w-full h-full bg-black90 z-10 transition-transform duration-300 ${
            isEdtingGroupInfo ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col justify-center items-center">
                <div>
                  {groupDetails?.imageUrl ? (
                    <img
                      src={groupDetails.imageUrl}
                      alt="Group"
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white7 rounded-full flex justify-center items-center capitalize text-white text-xl">
                      <FallbackImage name={groupDetails?.name} />
                    </div>
                  )}
                </div>

                <div className="w-full h-full mt-4 bg-black60 p-2 rounded-md">
                  <div>
                    <p className="text-white64 mb-1 pl-1">Name</p>
                    <TextInputArea textareaRef={groupNameRef} defaultValue={groupDetails?.name} handleSubmit={() => {}}/>
                  </div>
                  <div className="h-[1px] w-full bg-white7 rounded-full my-4"/>
                  <div className="h-full">
                    <p className="text-white64 mb-1 pl-1">Description</p>
                    <TextInputArea textareaRef={groupDescriptionRef} defaultValue={groupDetails?.description} handleSubmit={() => {}}/>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 h-8">
                <button
                  onClick={() => setIsEditingGroupInfo(false)}
                  disabled={isLoading}
                  className="text-white64 bg-red-500 px-3 py-1 w-20 flex justify-center items-center rounded-sm text-[14px] font-semibold h-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditGroupInfo}
                  disabled={isLoading}
                  className="text-white64 bg-green-600 px-4 py-1 w-20 flex justify-center items-center rounded-sm text-[14px] font-semibold h-full"
                >
                  {isLoading ? <SpinnerGap size={20} className="animate-spin"/> : "Save"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Edit Members Section */}
        <div className={`absolute bottom-0 left-0 w-full h-full bg-black90 z-10 transition-transform duration-300 ${
            isEditingMembers ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-center px-2 text-white88">
                <p>Members</p>
                <div>
                  <Trash className="h-4 w-4 text-red-500 hover:fill-red-700 cursor-pointer" onClick={removeMembers}/>
                </div>
              </div>
              <div className="border-b border-white7 my-1 mx-2"/>
              <MembersArray client={client} users={members} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} isRemovingMembers/>
            </div>

            <div className="flex justify-end items-center gap-2 h-8">
              <button
                onClick={() => setIsEditingMembers(false)}
                disabled={isLoading}
                className="text-white64 bg-red-500 px-3 py-1 w-20 flex justify-center items-center rounded-sm text-[14px] font-semibold h-full"
              >
                Cancel
              </button>
              <button
                onClick={handleEditGroupInfo}
                disabled={isLoading}
                className="text-white64 bg-green-600 px-4 py-1 w-20 flex justify-center items-center rounded-sm text-[14px] font-semibold h-full"
              >
                {isLoading ? <SpinnerGap size={20} className="animate-spin"/> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default GroupInfoModal