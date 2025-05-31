import {useEffect, useMemo, useState} from 'react';
import {GeoJsonFeature, TrackApi} from '../api/TrackApi.ts';

export const useTracksInfo = (hikeIds: number[]) => {
    const [tracks, setTracks] = useState<GeoJsonFeature[]>([]); // Указан тип GeoJsonFeature[]
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const trackApi = useMemo(() => new TrackApi(), []);

    useEffect(() => {
        const fetchTracks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const tracksData = await trackApi.getHikesGeoJson(hikeIds);
                setTracks(tracksData.features); // tracksData.features соответствует типу GeoJsonFeature[]
            } catch (err) {
                console.error('Error fetching tracks data:', err);
                setError('Failed to load tracks data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (hikeIds.length > 0) {
            fetchTracks();
        }
    }, [hikeIds, trackApi]);

    return {
        tracks,
        isLoading,
        error
    };
};