export interface Hike {
    id: number;
    title: string;
    description: string;
    photoPath: string;
    trackGpxPath: string; // Path to the GPX file for the hike track,
    reportPdfPath: string; // Path to the PDF report for the hike
    startDate: string; // ISO format
    endDate: string; // ISO format
    difficulty: number;
    isCategorical: boolean;
    area: string;
    hikeType: string;
    organizer: string;
}