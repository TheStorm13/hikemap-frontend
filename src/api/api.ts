import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {TokenService} from "../service/auth/TokenService.ts";

declare global {
    interface ImportMeta {
        env: {
            VITE_API_URL: string;
        };
    }
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = TokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

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
                const response = await axios.post<{
                    accessToken: string;
                    refreshToken: string;
                }>(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {refreshToken}, // Теперь отправляем как JSON объект
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Сохраняем оба токена
                TokenService.setTokens(
                    response.data.accessToken,
                    response.data.refreshToken
                );

                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                TokenService.clearTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;