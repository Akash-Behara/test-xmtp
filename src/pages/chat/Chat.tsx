import { Client, Conversation, Signer } from "@xmtp/browser-sdk";
import { useCallback, useEffect, useState } from "react";
import Conversations from "./components/Conversations";
import Messages from "./components/Messages";
import { createClient } from "./utils/createClient";
import { toBytes } from "viem/utils";

import { useEthersProvider } from "@/providers/ethersProvider";
import { useEthersSigner } from "@/providers/ethersSigner";


const Chat = () => {

  const etherProvider = useEthersProvider();
  const etherSigner = useEthersSigner();

  const [client, setClient] = useState<Client | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>();

  const handleCreateClient = useCallback(async () => {
    const signer: Signer = {
      getAddress: () => etherSigner?.getAddress()!,
      signMessage: async (message: string) => {
        const signature = await etherSigner?.signMessage(message);
        return toBytes(signature!);
      }
    }
    const client = await createClient(signer);
    setClient(client);
    await client.conversations.sync()
    
  }, [etherSigner, etherProvider])

  useEffect(() => {
    if(etherSigner == undefined) return
    if(!client) {
      handleCreateClient();
    }
  }, [etherSigner])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  }

  const handleDeSelectConversation = () => {
    setSelectedConversation(undefined);
  }
  
  return (
    <div className="size-full grid grid-cols-12 overflow-hidden relative">
      <div className="inset-0 w-full md:static col-span-12 md:col-span-3">
        <Conversations client={client} selectedConversation={selectedConversation} handleSelectConversation={handleSelectConversation}/>
      </div>
      <div className={`absolute md:static inset-0 ${selectedConversation ? "translate-x-0 z-10" : "translate-x-full md:translate-x-0"} transition duration-300 col-span-12 md:col-span-9  flex flex-col rounded-md`}>
        <Messages client={client} selectedConversation={selectedConversation} handleDeSelectConversation={handleDeSelectConversation}/>
      </div>
    </div>
  )
}

export default Chat