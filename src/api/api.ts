// src/api/api.ts
import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {TokenService} from "../service/auth/TokenService.ts";

const api = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = TokenService.getAccessToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = TokenService.getRefreshToken();
            if (!refreshToken) {
                TokenService.clearTokens();
                return Promise.reject(error);
            }

            try {
                // Note: Changed to match backend response format
                const response = await axios.post<{ ACCESS: string }>(
                    //@ts-ignore
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    refreshToken, // Just sending the raw refresh token string
                    {
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    }
                );

                const newAccessToken = response.data.ACCESS;
                TokenService.setTokens(newAccessToken, refreshToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                TokenService.clearTokens();
                // Redirect to login page or handle as needed
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;