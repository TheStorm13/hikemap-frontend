// src/api/AuthApi.ts
import api from './api';
import {TokenService} from '../service/auth/TokenService.ts';

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const AuthApi = {
    login: async (email: string, password: string): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('/auth/login', {email, password});
        return response.data;
    },

    register: async (userData: { username: string; email: string; password: string }): Promise<void> => {
        console.log('Данные для регистрации:', userData); // добавьте эту строку
        await api.post('/auth/register', userData);
    },

    refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
        // Note: Changed to send raw string and expect different response
        const response = await api.post<{ accessToken: string }>(
            '/auth/refresh',
            refreshToken,
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        );
        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            TokenService.clearTokens();
        }
    }
};