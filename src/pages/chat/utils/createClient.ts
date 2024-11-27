import { Client, type Signer } from "@xmtp/browser-sdk";
import { toBytes } from "viem/utils";

export const createClient = async (signer: Signer) => {
  const encryptionKeyHex = import.meta.env.VITE_ENCRYPTION_KEY;
  if (!encryptionKeyHex) {
    throw new Error("VITE_ENCRYPTION_KEY must be set in the environment");
  }
  const encryptionBytes = toBytes(encryptionKeyHex);

  // const { isConnected } = useAccount();
  // const publicClient = usePublicClient();

  // const getSigner = async () => {
  //   if (!isConnected) return null;

  //   const provider = new ethers.providers.Web3Provider(publicClient);
  //   const signer = provider.getSigner();
  //   console.log('Provider:', provider);
  //   console.log('Signer:', signer);

  //   return { provider, signer };
  // };

  // const wallet = createWallet(walletKey);
  // const signer: Signer = {
  //   getAddress: () => wallet.account.address,
  //   signMessage: async (message: string) => {
  //     const signature = await wallet.signMessage({
  //       message,
  //     });
  //     return toBytes(signature);
  //   },
  // };

  const client = await Client.create(signer, encryptionBytes, {
    env: "dev",
  });
  return client;
};