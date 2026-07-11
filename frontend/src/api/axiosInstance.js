import axios from 'axios';
import { useAuth } from '../context/authContext';

const axiosInstance = axios.create({
    baseURL: `/api/v1`,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh-token') && 
            !originalRequest.url.includes('/auth/login')
        ) {
            originalRequest._retry = true;

            try {
                await axiosInstance.post('/auth/refresh-token');

                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error); // Reject the error for all other cases
    }
);

export default axiosInstance;