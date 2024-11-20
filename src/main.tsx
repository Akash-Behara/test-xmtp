import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { mainnet } from 'viem/chains'
import { http } from 'wagmi'
import App from './App.tsx'
import './index.css'
import { WalletProvider } from './providers/walletProvider.tsx'

export const config = getDefaultConfig({
  appName: "XMTP V3",
  projectId: import.meta.env.VITE_PROJECT_ID as string,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WalletProvider>
  </StrictMode>,
)
