import axios from 'axios';

const baseURL = "https://api.example.com";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const tokenInterceptor = async (config: any) => {
    const token = "" // get token from local storage or from state management

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}

axiosInstance.interceptors.request.use(tokenInterceptor, Promise.reject);

export { axiosInstance };

export default axiosInstance;
