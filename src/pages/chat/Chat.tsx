import { createClient } from "./utils/createClient";

const Chat = () => {

    const handleCreateClient = async () => {
        const client = await createClient("key1");
        console.log('client', client)
    }
     
  return (
    <div>
        Chat
        <button onClick={handleCreateClient}>Create client</button>
    </div>
  )
}

export default Chat