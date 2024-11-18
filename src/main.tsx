import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { http, WagmiProvider } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { mainnet } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const config = getDefaultConfig({
  appName: "XMTP V3 Browser SDK Example Test",
  projectId: import.meta.env.VITE_PROJECT_ID as string,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
