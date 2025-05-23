// Типизируем ожидаемый ответ API (адаптируй под реальное API)
export interface ApiResponse {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export const fetchData = async (url: string): Promise<ApiResponse> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<ApiResponse>;
};