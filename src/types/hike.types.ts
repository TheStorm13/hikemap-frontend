// types/filter.types.ts
export interface FilterOptions {
    difficulties: number[];
    areas: string[];
    hikeTypes: string[];
    organizers: string[];
}

// types/hike.types.ts
export interface HikeTypes {
    id: number;
    title: string;
    description: string;
    photoPath: string;
    startDate: string; // ISO format
    endDate: string; // ISO format
    difficulty: number;
    isCategorical: boolean;
    area: string;
    hikeType: string;
    organizer: string;
}

export interface HikeFilters {
    search?: string;
    difficulty?: number;
    area?: string;
    hikeType?: string;
    organizer?: string;
    startDateFrom?: string;
    startDateTo?: string;
    isCategorical?: boolean;
}

// types/components.ts
export interface HikeBrowserProps {
    hikes: HikeTypes[];
    filterOptions: FilterOptions;
    filters: HikeFilters;
    selectedHike: HikeTypes | null;
    onFiltersChange: (filters: HikeFilters) => void;
    onSelectHike: (hike: HikeTypes) => void;
    children: React.ReactNode;
}