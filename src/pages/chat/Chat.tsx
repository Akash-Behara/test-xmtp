import { useCallback, useEffect, useState } from "react";
import { Client, Conversation } from "@xmtp/browser-sdk";
import { createClient } from "./utils/createClient";
import Conversations from "./components/Conversations";
import Messages from "./components/Messages";

const Chat = () => {

  const [client, setClient] = useState<Client | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>();

  const handleCreateClient = useCallback(async () => {
    const client = await createClient("key1");
    setClient(client);
  }, [])

  useEffect(() => {
    if(!client) {
      handleCreateClient();
    }
  }, [])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  }

  const handleDeSelectConversation = () => {
    setSelectedConversation(undefined);
  }
     
  return (
    <div className="size-full grid grid-cols-12">
      <div className="absolute w-full md:static col-span-12 md:col-span-3">
        <Conversations client={client} handleSelectConversation={handleSelectConversation}/>
      </div>
      <div className={`${selectedConversation ? "translate-x-0 z-10" : "translate-x-[1000px] md:translate-x-0"} transition duration-300 col-span-12 md:col-span-9 h-screen flex flex-col rounded-md`}>
        <Messages client={client} selectedConversation={selectedConversation} handleDeSelectConversation={handleDeSelectConversation}/>
      </div>
    </div>
  )
}

export default Chat