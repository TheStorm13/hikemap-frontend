import {useEffect, useMemo, useState} from 'react';
import {HikeApi} from '../api/HikeApi.ts';
import {HikeTypes} from '../types/hike.types.ts';
import {FilterOptions} from '../types/FilterOptions.ts';
import {HikeFilters} from '../types/HikeFilters.ts';

export const getHikesInfo = () => {
    const [hikes, setHikes] = useState<HikeTypes[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        difficulties: [],
        areas: [],
        hikeTypes: [],
        organizers: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<HikeFilters>({});
    const [selectedHike, setSelectedHike] = useState<HikeTypes | null>(null);
    const [error, setError] = useState<string | null>(null);


    // Мемоизируем контроллер, чтобы не создавать новый инстанс при каждом рендере
    const hikeController = useMemo(() => new HikeApi(), []);

    useEffect(() => {
        const fetchData = async () => {

            setIsLoading(true);
            setError(null);

            try {
                const [hikesData, optionsData] = await Promise.all([
                    hikeController.getHikes(filters),
                    Promise.resolve({
                        difficulties: [1, 2, 3], // Заглушка с числовыми значениями
                        areas: ['Горы', 'Леса', 'Поля'],
                        hikeTypes: ['Однодневный', 'Многодневный'],
                        organizers: ['Организатор 1', 'Организатор 2']
                    })// Заглушка
                    //hikeController.getFilterOptions()
                ]);
                setHikes(hikesData);
                setFilterOptions(optionsData);
            } catch (err) {
                console.error('Error fetching hikes data:', err);
                setError('Failed to load hikes data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filters, hikeController]);

    // Функция для ручного обновления данных
    const refreshHikes = async () => {
        setIsLoading(true);
        try {
            const hikesData = await hikeController.getHikes(filters);
            setHikes(hikesData);
        } catch (err) {
            console.error('Error refreshing hikes:', err);
            setError('Failed to refresh hikes data.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        hikes,
        filterOptions,
        isLoading,
        error,
        filters,
        selectedHike,
        setFilters,
        setSelectedHike,
        refreshHikes
    };
};