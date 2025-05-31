import React, {useCallback, useMemo, useState} from 'react';
import {Layout, Spin} from 'antd';
import {Header} from '../../components/Header.tsx';
import {Sidebar} from './components/Sidebar.tsx';
import {useHikesInfo} from '../../hooks/useHikesInfo.ts';
import {Hike} from "../../types/hike.ts";
import {FiltersPanel} from './components/filter/FiltersPanel.tsx';
import {HikeDetailsPanel} from './components/hikeDetails/HikeDetailsPanel.tsx';
import {Map} from './components/map/Map.tsx';
import {useTracksInfo} from "../../hooks/useTracksInfo.ts";

const HomePage: React.FC = () => {
    const [selectedHike, setSelectedHike] = useState<Hike | null>(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const {
        hikes,
        filters,
        filterOptions,
        isHikesLoading,
        error,
        setFilters
    } = useHikesInfo();

    const hikeIds = useMemo(() => hikes.map(hike => hike.id), [hikes]);

    const {tracks, isLoading: isTracksLoading} = useTracksInfo(hikeIds);

    const handleToggleFilters = useCallback(() => {
        setSelectedHike(null);
        setIsFiltersVisible(prev => !prev);
    }, []);

    const handleSelectHike = useCallback((hike: Hike | null) => {
        setIsFiltersVisible(false);

        if (selectedHike?.id === hike?.id) {
            setSelectedHike(null);
        } else {
            setSelectedHike(hike);
        }
    }, [selectedHike]);


    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header/>
            <Layout hasSider>
                <Sidebar
                    hikes={hikes}
                    filters={filters}
                    isFiltersVisible={isFiltersVisible}
                    selectedHike={selectedHike}
                    onFiltersChange={setFilters}
                    onSelectHike={handleSelectHike}
                    onToggleFilters={handleToggleFilters}
                />
                {isFiltersVisible && !selectedHike && (
                    <FiltersPanel
                        filters={filters}
                        filterOptions={filterOptions}
                        onFiltersChange={setFilters}
                        onClose={() => setIsFiltersVisible(false)}
                    />
                )}

                {selectedHike && !isFiltersVisible && (
                    <HikeDetailsPanel
                        hike={selectedHike}
                        onClose={() => handleSelectHike(null)}
                    />
                )}

                <Map
                    tracks={tracks}
                    selectedHikeId={selectedHike?.id || null}
                />
            </Layout>
        </Layout>
    );
};

export default HomePage;