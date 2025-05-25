import {HikeFilters} from "../types/HikeFilters.ts";
import {HikeTypes} from "../types/hike.ts";
import {FilterOptions} from "../types/FilterOptions.ts";

import api from './api.ts'; // Импортируем настроенный экземпляр axios с интерцепторами

interface HikeResponse {
    id: number;
    title: string;
    description: string;
    photoPath: string;
    startDate: string;
    endDate: string;
    difficulty: number;
    is_categorical: boolean;
    area: string;
    hikeType: string;
    organizer: string;
}

export class HikeApi {
    // Используем уже настроенный экземпляр axios с JWT-интерцепторами


    private api = api;

    async getHikes(filters?: HikeFilters): Promise<HikeTypes[]> {
        try {
            const params = {
                search: filters?.search,
                difficulty: filters?.difficulty,
                areaId: filters?.areaId,
                hikeTypeId: filters?.hikeTypeId,
                organizerId: filters?.organizerId,
                startDateFrom: filters?.startDateFrom,
                startDateTo: filters?.startDateTo,
                isCategorical: filters?.isCategorical
            };

            const response = await this.api.get<HikeResponse[]>('/hikes/filters', {params});
            return response.data.map((hike: HikeResponse) => this.mapHikeResponse(hike));
        } catch (error) {
            console.error('Error fetching hikes:', error);
            throw error;
        }
    }

    async getAllHikes(): Promise<HikeTypes[]> {
        try {
            const response = await this.api.get<HikeResponse[]>('/hikes/all');
            return response.data.map((hike: HikeResponse) => this.mapHikeResponse(hike));
        } catch (error) {
            console.error('Error fetching all hikes:', error);
            throw error;
        }
    }

    async getFilterOptions(): Promise<FilterOptions> {
        try {
            const response = await this.api.get<FilterOptions>('/filters');
            return response.data;
        } catch (error) {
            console.error('Error fetching filter options:', error);
            throw error;
        }
    }

    private mapHikeResponse(hike: HikeResponse): HikeTypes {
        return {
            id: hike.id,
            title: hike.title,
            description: hike.description,
            photoPath: hike.photoPath,
            startDate: hike.startDate,
            endDate: hike.endDate,
            difficulty: hike.difficulty,
            isCategorical: hike.is_categorical,
            area: hike.area,
            hikeType: hike.hikeType,
            organizer: hike.organizer
        };
    }
}