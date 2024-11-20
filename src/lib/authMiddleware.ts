import axios from 'axios';

export const authMiddleware = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Function to check if the token is expired
  const isTokenExpired = (token: string) => {
    if (!token) return true;
    const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return Date.now() >= exp * 1000; // Check expiry
  };

  // Handle expired token
  if (isTokenExpired(accessToken!)) {
    if (refreshToken) {
      try {
        // Refresh the token
        const response = await axios.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', response.data.accessToken);
        return true; // Token refreshed
      } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return false; // Token refresh failed
      }
    } else {
      return false; // No refresh token, user needs to log in
    }
  }

  return true; // Token is valid
};
