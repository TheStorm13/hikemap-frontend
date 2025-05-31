import api from './api.ts';

// Тип для ответа с информацией о регионе
interface AreaResponse {
    id: number;
    name: string;
}

export class AreaApi {
    private api = api;
    private areasCache: AreaResponse[] | null = null;

    /**
     * Получить все регионы
     */
    async getAllAreas(forceRefresh = false): Promise<AreaResponse[]> {
        if (this.areasCache && !forceRefresh) {
            return this.areasCache;
        }

        try {
            const response = await this.api.get<AreaResponse[]>('/hikes/areas');
            this.areasCache = response.data;
            return response.data;
        } catch (error) {
            console.error('Error fetching areas:', error);
            throw new Error('Не удалось загрузить список регионов');
        }
    }

    /**
     * Получить регион по ID
     */
    async getAreaById(id: number): Promise<AreaResponse> {
        try {
            // Сначала проверяем кэш
            if (this.areasCache) {
                const cachedArea = this.areasCache.find(area => area.id === id);
                if (cachedArea) return cachedArea;
            }

            const response = await this.api.get<AreaResponse>(`/hikes/areas/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching areas:', error.message);
            } else {
                console.error('Unknown error fetching areas:', error);
            }
            throw new Error('Не удалось загрузить список регионов');
        }
    }

}