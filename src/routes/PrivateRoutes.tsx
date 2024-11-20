import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { authMiddleware } from '../lib/authMiddleware';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//         const isAuth = await authMiddleware();
//         setIsAuthenticated(isAuth);
//     };
//     checkAuth();
//   }, []);

  // Show loading while checking auth status
//   if (isAuthenticated === false) {
//     return <div>Loading...</div>;
//   }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" />;
};

export default PrivateRoute;
