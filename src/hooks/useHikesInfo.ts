import {useEffect, useMemo, useState} from 'react';
import {HikeApi} from '../api/HikeApi.ts';
import {Hike} from '../types/hike.ts';
import {FilterOptions} from '../types/FilterOptions.ts';
import {HikeFilters} from '../types/HikeFilters.ts';
import {AreaApi} from '../api/AreaApi.ts';
import {HikeTypeApi} from '../api/HikeTypeApi.ts';
import {UserApi} from '../api/UserApi.ts';

export const useHikesInfo = () => {
    const [hikes, setHikes] = useState<Hike[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        difficulties: [],
        areas: [],
        hikeTypes: [],
        organizers: []
    });
    const [isHikesLoading, setIsHikesLoading] = useState(true);
    const [filters, setFilters] = useState<HikeFilters>({});
    const [error, setError] = useState<string | null>(null);

    const hikeApi = useMemo(() => new HikeApi(), []);
    const areaApi = useMemo(() => new AreaApi(), []);
    const hikeTypeApi = useMemo(() => new HikeTypeApi(), []);
    const userApi = useMemo(() => new UserApi(), []);

    useEffect(() => {
        const fetchData = async () => {
            setIsHikesLoading(true);
            setError(null);

            try {
                const [hikesData, optionsData] = await Promise.all([
                    hikeApi.getHikes(filters),
                    (async () => {
                        const [areas, hikeTypes, organizers] = await Promise.all([
                            areaApi.getAllAreas(),
                            hikeTypeApi.getAllHikeTypes(),
                            userApi.getAllOrganizer()
                        ]);
                        return {
                            difficulties: [0, 1, 2, 3, 4, 5, 6],
                            areas: areas.map(area => area.name),
                            hikeTypes: hikeTypes.map(type => type.name),
                            organizers: organizers.map(user => user.username)
                        };
                    })()
                ]);
                setHikes(hikesData);
                setFilterOptions(optionsData);
            } catch (err) {
                console.error('Error fetching hikes data:', err);
                setError('Failed to load hikes data. Please try again later.');
            } finally {
                setIsHikesLoading(false);
            }
        };

        fetchData();
    }, [JSON.stringify(filters), hikeApi]);

    const refreshHikes = async () => {
        setIsHikesLoading(true);
        try {
            const hikesData = await hikeApi.getHikes(filters);
            setHikes(hikesData);
        } catch (err) {
            console.error('Error refreshing hikes:', err);
            setError('Failed to refresh hikes data.');
        } finally {
            setIsHikesLoading(false);
        }
    };

    return {
        hikes,
        filters,
        filterOptions,
        isHikesLoading,
        error,
        setFilters,
        refreshHikes
    };
};