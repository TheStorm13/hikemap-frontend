import api from './api.ts';

export class FileApi {
    private api = api;

    /**
     * Загрузить файл
     * @param hikeId ID похода
     * @param type Тип файла
     * @returns Promise с URL для скачивания
     */
    async downloadFile(hikeId: number, type: string): Promise<void> {
        try {
            // Создаем скрытый iframe для скачивания файла
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // Формируем URL с параметрами
            const url = `/files/download?hikeId=${hikeId}&type=${encodeURIComponent(type)}`;

            // Устанавливаем src iframe для запуска скачивания
            iframe.src = url;

            // Удаляем iframe после загрузки
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);

        } catch (error) {
            console.error('Error downloading file:', error);
            throw new Error('Не удалось загрузить файл');
        }
    }

    /**
     * Альтернативный метод загрузки файла с использованием Blob
     */
    async downloadFileAsBlob(hikeId: number, type: string): Promise<void> {
        try {
            const response = await this.api.get(`/files/download`, {
                params: {hikeId, type},
                responseType: 'blob'
            });

            // Создаем URL для Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Создаем ссылку для скачивания
            const link = document.createElement('a');
            link.href = url;

            // Получаем имя файла из заголовков или генерируем
            const contentDisposition = response.headers['content-disposition'];
            let fileName = `hike_${hikeId}_${type}`;

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length > 1) {
                    fileName = fileNameMatch[1];
                }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Очистка
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw new Error('Не удалось загрузить файл');
        }
    }
}