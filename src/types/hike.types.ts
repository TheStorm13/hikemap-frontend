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