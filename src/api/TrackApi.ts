import api from './api.ts';

// Типы для GeoJSON ответа
export interface GeoJsonFeature {
    type: string;
    geometry: {
        type: string;
        coordinates: number[][];
    };
    properties: Record<string, any>;

}

interface HikeGeoJsonResponse {
    type: string;
    features: GeoJsonFeature[];
}

export class TrackApi {
    private api = api;

    /**
     * Получить GeoJSON данные треков походов
     * @param hikeIds Массив ID походов
     */
    async getHikesGeoJson(hikeIds: number[]): Promise<HikeGeoJsonResponse> {
        try {
            const response = await this.api.get<HikeGeoJsonResponse>(
                '/tracks/geojson',
                {
                    params: {hikeIds: hikeIds.join(',')}, // Преобразуем массив в строку
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching hikes GeoJSON:', error);
            throw error;
        }
    }
}