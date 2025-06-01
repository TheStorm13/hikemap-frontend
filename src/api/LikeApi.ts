import api from './api.ts'; // Импортируем настроенный экземпляр axios с интерцепторами
import {Hike} from "../types/hike.ts";


export class LikeApi {
    // Используем уже настроенный экземпляр axios с JWT-интерцепторами


    private api = api;


    async likeHike(hikeId: number): Promise<void> {
        try {
            await this.api.put(`/likes/${hikeId}`);
        } catch (error) {
            console.error(`Error liking hike with id ${hikeId}:`, error);
            throw new Error("Ошибка при добавлении лайка" + error);
        }
    }


    async getLikedHikes(): Promise<Hike[]> {
        try {
            const response = await this.api.get<Hike[]>('/likes');
            return response.data;
        } catch (error) {
            console.error('Error fetching liked hikes:', error);
            throw new Error("Ошибка при получении данных о лайке о походе" + error);
        }
    }
}