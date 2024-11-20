import RoutesComponents from './routes/Routes'

const Layout = () => {
  return (
    <div className='flex justify-center items-center bg-black20/90 h-screen'>
      <div className='max-w-[1200px] size-full'>
        <RoutesComponents />
      </div>
    </div>
  )
}

export default Layout