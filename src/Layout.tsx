import { WalletConnectButton } from './components/Wallet/WalletConnectButton'
import RoutesComponents from './routes/Routes'

const Layout = () => {
  return (
    <div className='flex justify-center items-center bg-black20/90 h-screen relative'>
      <div className='fixed top-3 left-2 z-50'>
        <WalletConnectButton />
      </div>
      <div className='max-w-[1200px] size-full'>
        <RoutesComponents />
      </div>
    </div>
  )
}

export default Layout