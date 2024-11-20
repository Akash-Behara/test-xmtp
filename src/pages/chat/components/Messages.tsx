import { ArrowLeft, Plus, Smiley, UsersThree } from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client, Conversation } from "@xmtp/browser-sdk";
import { useCallback, useRef, useState } from "react";

interface MessagesProps {
  client: Client | null;
  selectedConversation: Conversation | undefined;
  handleDeSelectConversation: () => void;
}

const Messages = ({ client, selectedConversation, handleDeSelectConversation }: MessagesProps) => {
  const queryClient = useQueryClient();

  const getMessages = async () => {
    const conversation = new Conversation(client!, selectedConversation?.id!);
    const messages = await conversation.messages();
    return messages;
  }

  const {data: messages, isLoading: isLoadingMessages} = useQuery({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: getMessages,
    enabled: !!client
  })


  const {data: members, isLoading: isLoadingMembers} = useQuery({
    queryKey: ["members", selectedConversation?.id],
    queryFn: async () => await selectedConversation?.members(),
    enabled: !!client && !!selectedConversation
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height
      setIsExpanded(textareaRef.current.scrollHeight > 40); // Check height to toggle border style
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if(!textareaRef.current?.value) return;
      sendMessage(textareaRef?.current?.value);  
      console.log("Message sent:", textareaRef.current?.value);

      if (textareaRef.current) textareaRef.current.value = "";
      handleInputChange(); // Reset the height
    }
  }

  const sendMessage = useCallback(async (message: string) => {
    queryClient.setQueryData(['messages', selectedConversation?.id], (oldMessages: any) => {
      return oldMessages ? [...oldMessages, { content: message, contentType: { typeId: "text" } }] : [{ content: message, contentType: { typeId: "text" } }];
    });
    await selectedConversation?.send(message);
    queryClient.invalidateQueries(['messages', selectedConversation?.id] as any);
  }, [queryClient, selectedConversation?.id]);

  return (
    <div className="h-screen flex flex-col rounded-md">
      <div className="h-[80px] flex items-center bg-black60 p-2">
        <div className="mr-2 block md:hidden">
          <ArrowLeft size={20} weight="bold" onClick={handleDeSelectConversation} className="cursor-pointer text-white88"/>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white/80 rounded-full p-2">
            <UsersThree className="size-4 md:size-8"/>
          </div>
          <div>
            <p className="font-semibold text-white88">{selectedConversation?.name}</p>
            <div className="flex items-center gap-2">
              {isLoadingMembers ? <div>Loading...</div> : members?.map((member, idx) => (
                <p key={idx} className="text-white32 text-[12px]">{member.accountAddresses[0]?.slice(0, 5) + "..." + member?.accountAddresses[0]?.slice(-5)} {idx < members.length - 1 && ","}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-black40">
        {isLoadingMessages ? <div>Loading...</div> :
        messages?.length == 0 ? <div className="text-white64">No messages found</div> :
        messages?.map((message, idx) => {
          if(message?.contentType?.typeId != "text") return null
          return <div key={idx}>
            <p className="text-white88">{message?.content}</p>
          </div>
        })}
      </div>

      <div className="min-h-[50px] h-auto bg-black60 flex items-center gap-2 px-2 py-1">
        <div>
          <Plus size={24} className="text-white88"/>
          <div></div>
        </div>
        <div className={`w-full flex items-center mx-auto relative bg-black70 transition duration-300 ${isExpanded ? "rounded-md" : " rounded-full"}`}>
          <textarea
            ref={textareaRef}
            className={`w-full max-w-[97%] px-3 py-2 text-sm text-white88 outline-none resize-none overflow-hidden bg-transparent transition duration-300 ${
              isExpanded ? "rounded-md" : "rounded-full"
            }`}

            placeholder="Type your message..."
            onInput={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2"><Smiley size={24} className="text-white88"/></div>
        </div>
      </div>
    </div>
  )
}

export default Messages