import React, {useCallback, useState} from 'react';
import {Layout, Spin} from 'antd';
import {Header} from '../../components/Header.tsx';
import {Sidebar} from './components/Sidebar.tsx';
import {useHikesInfo} from '../../hooks/useHikesInfo.ts'
import {Hike} from "../../types/hike.ts";
import {FiltersPanel} from './components/filter/FiltersPanel.tsx';
import {HikeDetailsPanel} from './components/hikeDetails/HikeDetailsPanel.tsx';

const HomePage: React.FC = () => {
    const [selectedHike, setSelectedHike] = useState<Hike | null>(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const {
        hikes,
        filters,
        filterOptions,
        isLoading,
        setFilters
    } = useHikesInfo();

    const handleToggleFilters = useCallback(() => {
        setSelectedHike(null);
        setIsFiltersVisible(prev => !prev);
    }, []);

    const handleSelectHike = useCallback((hike: Hike | null) => {
        // Закрываем фильтры в любом случае
        setIsFiltersVisible(false);

        // Если кликаем на уже выбранный поход - закрываем его
        if (selectedHike?.id === hike?.id) {
            setSelectedHike(null);
        } else {
            // Иначе открываем новый поход
            setSelectedHike(hike);
        }
    }, [selectedHike]);

    if (isLoading) return <Spin size="large"/>;

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


            </Layout>
        </Layout>
    )
        ;
};

export default HomePage;