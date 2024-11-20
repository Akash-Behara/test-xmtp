import ErrorBoundary from './components/Errorboundary'
import Layout from './Layout'

function App() {

  return (
    <ErrorBoundary>
      <Layout />
    </ErrorBoundary>
  )
}

export default App
