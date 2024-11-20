import RoutesComponents from './routes/Routes'

const Layout = () => {
  return (
    <div className='flex justify-center items-center bg-slate-900 h-screen'>
      <div className='max-w-[1200px] bg-white size-full'>
        <RoutesComponents />
      </div>
    </div>
  )
}

export default Layout