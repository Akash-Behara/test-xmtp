import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, DotsThreeVertical, Plus, User, UsersThree } from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client, Conversation, DecodedMessage } from "@xmtp/browser-sdk";
import { useCallback, useRef, useState } from "react";
import GroupInfoModal from "./Group/GroupInfoModal";
import TextInputArea from "./ui/TextInputArea";

interface MessagesProps {
  client: Client | null;
  selectedConversation: Conversation | undefined;
  handleDeSelectConversation: () => void;
}

const Messages = ({ client, selectedConversation, handleDeSelectConversation }: MessagesProps) => {
  const queryClient = useQueryClient();

  const [conversation, setConversation] = useState<Conversation | undefined>();

  const getMessages = async () => {
    if(!client || !selectedConversation) return [];
    const conversation = new Conversation(client!, selectedConversation?.id!);
    setConversation(conversation);
    await conversation?.sync();
    const messages = await conversation.messages();
    return messages;
  }

  const {data: messages, isLoading: isLoadingMessages} = useQuery({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: getMessages,
    // enabled: !!client || !!selectedConversation
    refetchInterval: 1500
  })

  const {data: members, isLoading: isLoadingMembers} = useQuery({
    queryKey: ["members", conversation?.id],
    queryFn: async () => await conversation?.members(),
    enabled: !!client || !!selectedConversation
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useCallback(async () => {
    queryClient.setQueryData(['messages', selectedConversation?.id], (oldMessages: any) => {
      return oldMessages ? [...oldMessages, { content: textareaRef?.current?.value, senderInboxId: client?.inboxId, contentType: { typeId: "text" } }] : [{ content: textareaRef?.current?.value, senderInboxId: client?.inboxId, contentType: { typeId: "text" } }];
    });
    queryClient.setQueryData(['conversations'], (oldConversations: any) => {
      if (!oldConversations) return oldConversations;

      return oldConversations.map((convo: any) =>
        convo.id === conversation?.id
          ? { ...convo, lastMessage: textareaRef?.current?.value, lastMessageTime: new Date().getTime() }
          : convo
      );
    });
    await conversation?.send(textareaRef?.current?.value);
    queryClient.invalidateQueries(['messages', selectedConversation?.id] as any);
    // queryClient.invalidateQueries(['conversations'] as any);

  }, [queryClient, conversation, selectedConversation?.id]);

  const MessageContainer = ({message}: {message: DecodedMessage}) => {
 
    const isCurrentUser = client?.inboxId == message?.senderInboxId

    if(message?.contentType?.typeId != "text") return null

    if(message?.contentType?.typeId == "text") {
      return (
        <div className="w-full h-auto px-2 mb-2">
          <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div className={`${isCurrentUser ? "bg-green-500" : "bg-white/40 text-white"} max-w-[75%] p-2 rounded-md`}>
              {message?.content}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-screen flex flex-col rounded-md">
      <div className="h-[80px] flex items-center bg-black60 p-2">
        <div className="mr-2 block md:hidden">
          <ArrowLeft size={20} weight="bold" onClick={handleDeSelectConversation} className="cursor-pointer text-white88"/>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="bg-white/80 rounded-full p-2">
              {selectedConversation?.metadata?.conversationType == "dm" 
                ? <User color="#000" weight="fill" size={24}/>
                : <UsersThree color="#000" weight="fill" size={24}/>
              }
            </div>
            <div>
              <p className="font-semibold text-white88">{
                isLoadingMembers ? "Loading..." :
                selectedConversation?.metadata?.conversationType == "dm" ? members && members?.filter((user) => user?.accountAddresses[0]?.trim()?.toLowerCase() != client?.accountAddress?.trim()?.toLowerCase())[0]?.accountAddresses[0] :
                selectedConversation?.name
              }
              </p>
              {selectedConversation?.metadata?.conversationType != "dm" && <div className="flex items-center gap-2">
                {isLoadingMembers ? <div>Loading...</div> : members?.map((member, idx) => (
                  <p key={idx} className="text-white32 text-[12px]">{member.accountAddresses[0]?.slice(0, 5) + "..." + member?.accountAddresses[0]?.slice(-5)} {idx < members.length - 1 && ","}</p>
                ))}
              </div>}
            </div>
          </div>
          <div>
            <Dialog>
              <DialogTrigger><DotsThreeVertical className="text-white88 hover:text-white cursor-pointer size-6 hover:scale-105 transition duration-100"/></DialogTrigger>
              <GroupInfoModal client={client} groupDetails={selectedConversation} members={members}/>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-black40">
        {isLoadingMessages ? <div>Loading...</div> :
        messages?.length == 0 ? <div className="text-white64">No messages found</div> :
        messages?.map((message, idx) => {
          if(message?.contentType?.typeId != "text") return null
          return <div key={idx}>
            <MessageContainer message={message} />
          </div>
        })}
      </div>

      <div className="min-h-[50px] h-auto bg-black60 flex items-center gap-2 px-2 py-1">
        <div>
          <Plus size={24} className="text-white88"/>
        </div>
        <TextInputArea textareaRef={textareaRef} handleSubmit={sendMessage} hasIcon/>
      </div>
    </div>
  )
}

export default Messages