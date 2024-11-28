import { useQuery } from "@tanstack/react-query";

import { User, UsersThree } from "@phosphor-icons/react";
import { Client, Conversation } from "@xmtp/browser-sdk";
import CreateGroupModal from "./Group/CreateGroupModal";

interface ConversationsProps {
  client: Client | null;
  selectedConversation: Conversation | undefined;
  handleSelectConversation: (conversation: Conversation) => void;
}


const Conversations = ({ client, handleSelectConversation }: ConversationsProps) => {

  const getConversations = async () => {
    if (!client) return [];
    await client?.conversations?.sync();

    const conversations = await client?.conversations?.list();

    const conversationData = await Promise.all(
      conversations?.map(async (convo: Conversation) => {
        const messages = await convo.messages({ limit: 1n });
        const lastMessage = messages[0] || null;
        const members = await convo.members();
        return {
          ...convo,
          addedByInboxId: convo?.addedByInboxId,
          createdAt: convo?.createdAt,
          createdAtNs: convo?.createdAtNs,
          description: convo?.description,
          id: convo?.id, 
          imageUrl:  convo?.imageUrl,
          isActive: convo?.isActive,
          metadata: convo?.metadata,
          name: convo?.name,
          permissions: convo?.permissions,
          pinnedFrameUrl: convo?.pinnedFrameUrl,
          lastMessage: lastMessage?.content || "No messages yet",
          lastMessageTime: lastMessage?.sentAtNs || null,
          mem: members
        };
      })
    );

    return conversationData;
  }


  const {data: conversationList, isLoading: isLoadingConversations} = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: client != null,
    refetchInterval: 1500
  })

  return (
    <div className="h-screen flex flex-col bg-black70">
      <div className="h-[100px] flex flex-col justify-between items-end p-2">
        <CreateGroupModal client={client} conversationList={conversationList} handleSelectConversation={handleSelectConversation}/>
        <div className="flex items-center gap-2">
          <div className="w-fit px-4 py-[2px] text-white88 border border-green-900 rounded-full bg-green-200/20 hover:bg-green-200/30 cursor-pointer text-[14px] font-semibold">All</div>
          <div className="w-fit px-4 py-[2px] text-white88 border border-green-900 rounded-full bg-green-200/20 hover:bg-green-200/30 cursor-pointer text-[14px] font-semibold">1:1</div>
          <div className="w-fit px-4 py-[2px] text-white88 border border-green-900 rounded-full bg-green-200/20 hover:bg-green-200/30 cursor-pointer text-[14px] font-semibold">Groups</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoadingConversations
          ? <div>Loading...</div>
          : conversationList?.length == 0 ? <div className="text-white64 px-4 mt-4">No conversations Found</div>
          : conversationList?.map((conversation: any) => (
            <div key={conversation?.id} onClick={() => handleSelectConversation(conversation)} className="flex justify-between items-center py-3 px-2 cursor-pointer hover:bg-white/10 rounded-sm transition duration-200">
              <div className="flex items-center gap-2">
                <div className="bg-white/30 rounded-full p-2">
                  {conversation?.metadata?.conversationType == "dm" 
                    ? <User color="#000" weight="fill" size={24}/>
                    : <UsersThree color="#000" weight="fill" size={24}/>
                  }
                </div>
                <div className="">
                  <p className="font-semibold text-white">
                    {conversation?.metadata?.conversationType === "dm"
                      ? conversation?.mem
                          ?.filter((user: any) => {
                            return user?.accountAddresses[0]?.trim()?.toLowerCase() !== client?.accountAddress?.trim()?.toLowerCase();
                          })
                          ?.map((user: any) => {
                            const address = user?.accountAddresses[0];
                            return `${address?.slice(0, 5)}...${address?.slice(-5)}`;
                          })
                          .join(", ")
                      : conversation?.name}
                  </p>
                  <p className="font-semibold text-[12px] text-white/60">hi</p>
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
