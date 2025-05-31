import api from './api';

export class FileApi {
    private api = api;

    /**
     * Скачивание файла с обработкой JSON-обёртки
     * @param hikeId - ID похода
     * @param type - Тип файла (gpx, pdf и т.д.)
     * @param customFileName - Опциональное имя файла
     */
    async downloadFile(hikeId: number, type: string, customFileName?: string): Promise<void> {
        try {
            // 1. Получаем ответ от сервера как JSON
            const response = await this.api.get(`/files/download?hikeId=${hikeId}&type=${type}`);

            // 2. Извлекаем бинарные данные из JSON
            const fileData = this.extractFileDataFromJson(response.data, type);

            // 3. Создаём Blob с правильным MIME-типом
            const blob = new Blob([fileData], {type: this.getMimeType(type)});

            // 4. Скачиваем файл
            const fileName = customFileName || this.generateFileName(hikeId, type);
            this.downloadBlob(blob, fileName);

        } catch (error) {
            console.error('File download failed:', error);
            throw this.normalizeError(error);
        }
    }

    /**
     * Извлекает файловые данные из JSON-ответа
     */
    private extractFileDataFromJson(jsonData: any, fileType: string): ArrayBuffer {
        // Вариант 1: Данные в base64
        if (jsonData.content && jsonData.encoding === 'base64') {
            return this.base64ToArrayBuffer(jsonData.content);
        }

        // Вариант 2: Данные в бинарном виде (как массив чисел)
        if (jsonData.data && Array.isArray(jsonData.data)) {
            return new Uint8Array(jsonData.data).buffer;
        }

        // Вариант 3: Прямая строка (для текстовых форматов)
        if (typeof jsonData === 'string') {
            return new TextEncoder().encode(jsonData).buffer;
        }

        throw new Error(`Unsupported JSON format for ${fileType} file`);
    }

    /**
     * Преобразование base64 в ArrayBuffer
     */
    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Определение MIME-типа по расширению файла
     */
    private getMimeType(fileType: string): string {
        const types: Record<string, string> = {
            gpx: 'application/gpx+xml',
            pdf: 'application/pdf',
            jpg: 'image/jpeg',
            png: 'image/png',
            // Добавьте другие типы по необходимости
        };
        return types[fileType.toLowerCase()] || 'application/octet-stream';
    }

    /**
     * Генерация имени файла
     */
    private generateFileName(hikeId: number, fileType: string): string {
        return `hike_${hikeId}_${Date.now()}.${fileType}`;
    }

    /**
     * Скачивание Blob как файла
     */
    private downloadBlob(blob: Blob, fileName: string): void {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Очистка
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * Обработка ошибок
     */
    private normalizeError(error: any): Error {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }
        return error instanceof Error ? error : new Error('File download failed');
    }
}