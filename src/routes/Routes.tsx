import { Navigate, Route, Routes } from "react-router-dom"
import Chat from "../pages/chat/Chat"
import SignUp from "../pages/onboarding/SignUp"
import PrivateRoute from "./PrivateRoutes"

const RoutesComponents = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<SignUp />} />

      {/* Private routes */}
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to={'/chat'} />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
  )
}

export default RoutesComponents
