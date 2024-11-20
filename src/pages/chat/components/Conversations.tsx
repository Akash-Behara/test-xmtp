import { useQuery } from "@tanstack/react-query";

import { UsersThree } from "@phosphor-icons/react";
import { Client, Conversation } from "@xmtp/browser-sdk";
import CreateGroupModal from "./Group/CreateGroupModal";

interface ConversationsProps {
  client: Client | null;
  handleSelectConversation: (conversation: Conversation) => void;
}

const Conversations = ({ client, handleSelectConversation }: ConversationsProps) => {

  // const [conversations, setConversations] = useState<Conversation[]>([]);

  const {data: conversationList, isLoading: isLoadingConversations} = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => await client!.conversations.list(),
    enabled: !!client
  })

  return (
    <div className="h-screen flex flex-col bg-black70">
      <div className="h-[100px] flex flex-col justify-between items-end p-2">
        <CreateGroupModal />
        <div className="flex items-center gap-2">
          <div className="w-fit px-4 py-[2px] text-white88 border border-green-900 rounded-full bg-green-200/20 hover:bg-green-200/30 cursor-pointer text-[14px] font-semibold">All</div>
          <div className="w-fit px-4 py-[2px] text-white88 border border-green-900 rounded-full bg-green-200/20 hover:bg-green-200/30 cursor-pointer text-[14px] font-semibold">1:1</div>
          <div className="w-fit px-4 py-[2px] text-white88 border border-green-900 rounded-full bg-green-200/20 hover:bg-green-200/30 cursor-pointer text-[14px] font-semibold">Groups</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoadingConversations
          ? <div>Loading...</div>
          : conversationList?.length == 0 ? <div>No conversations</div>
          : conversationList?.map((conversation) => (
            <div key={conversation?.id} onClick={() => handleSelectConversation(conversation)} className="flex justify-between items-center py-3 px-2 cursor-pointer hover:bg-white/10 rounded-sm transition duration-200">
              <div className="flex items-center gap-2">
                <div className="bg-white/30 rounded-full p-2">
                  <UsersThree color="#000" weight="fill" size={24}/>
                </div>
                <div className="">
                  <p className="font-semibold text-white">{conversation?.name}</p>
                  <p className="font-semibold text-[12px] text-white/60">last message</p>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end h-full gap-1">
                <p className="text-white/50 text-[12px]">2:20pm</p>
                <div className="bg-greenText rounded-full w-4 h-4 p-2 text-[10px] flex justify-center items-center">1</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Conversations

