import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
    appName: "XMTP V3 Browser SDK Example",
    projectId: import.meta.env.VITE_PROJECT_ID as string,
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
});

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);