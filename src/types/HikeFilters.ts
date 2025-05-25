export interface HikeFilters {
    search?: string;
    sortBy?: 'title' | 'startDate' | 'difficulty';
    difficulty?: number;
    areaId?: number;
    hikeTypeId?: number;
    organizerId?: number;
    startDateFrom?: string;
    startDateTo?: string;
    isCategorical?: boolean;
}