import api from './api.ts';

// Тип для ответа с типом похода
interface HikeTypeResponse {
    id: number;
    name: string;
}

export class HikeTypeApi {
    private api = api;

    /**
     * Получить все типы походов
     */
    async getAllHikeTypes(): Promise<HikeTypeResponse[]> {
        try {
            const response = await this.api.get<HikeTypeResponse[]>('/hikes/types');
            return response.data;
        } catch (error) {
            console.error('Error fetching hike types:', error);
            throw error;
        }
    }

    /**
     * Получить тип похода по ID
     * @param id ID типа похода
     */
    async getHikeTypeById(id: number): Promise<HikeTypeResponse> {
        try {
            const response = await this.api.get<HikeTypeResponse>(`/hikes/types/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching hike type with id ${id}:`, error);
            throw error;
        }
    }
}