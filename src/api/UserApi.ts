import api from './api.ts';

// Типы для запросов и ответов
interface UserResponse {
    id: number;
    username: string;
    email: string;
}

interface UserRequest {
    username?: string;
    email?: string;
    password?: string;
}

export class UserApi {
    private api = api;

    /**
     * Получить пользователя по ID
     * @param id ID пользователя
     */
    async getUserById(id: number): Promise<UserResponse> {
        try {
            const response = await this.api.get<UserResponse>(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Пользователь не найден');
            }
            console.error(`Error fetching user with id ${id}:`, error);
            throw new Error('Не удалось загрузить данные пользователя');
        }
    }

    /**
     * Обновить данные пользователя
     * @param id ID пользователя
     * @param userData Данные для обновления
     */
    async updateUser(id: number, userData: UserRequest): Promise<UserResponse> {
        try {
            // Проверяем, есть ли данные для обновления
            if (!userData.username && !userData.email && !userData.password) {
                throw new Error('Нет данных для обновления');
            }

            const response = await this.api.put<UserResponse>(
                `/users/${id}`,
                userData
            );

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Некорректные данные для обновления');
            }
            if (error.response?.status === 403) {
                throw new Error('Недостаточно прав для обновления пользователя');
            }
            if (error.response?.status === 404) {
                throw new Error('Пользователь не найден');
            }

            console.error(`Error updating user with id ${id}:`, error);
            throw new Error('Не удалось обновить данные пользователя');
        }
    }

    /**
     * Получить текущего аутентифицированного пользователя
     * (дополнительный метод, если есть endpoint /users/me)
     */
    async getCurrentUser(): Promise<UserResponse> {
        try {
            const response = await this.api.get<UserResponse>('/users/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw new Error('Не удалось загрузить данные текущего пользователя');
        }
    }

    async getAllOrganizer(): Promise<UserResponse[]> {
        try {
            const response = await this.api.get<UserResponse[]>('/users/organizers');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw new Error('Не удалось загрузить данные текущего пользователя');
        }
    }
}