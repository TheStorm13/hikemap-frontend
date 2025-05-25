import React from 'react';
import {Layout, Spin} from 'antd';
import {Header} from '../../components/Header.tsx';
import {Sidebar} from './components/Sidebar.tsx';
import {getHikesInfo} from '../../hooks/getHikesInfo.ts'

const HomePage: React.FC = () => {

    const {
        hikes,
        filterOptions,
        isLoading,
        filters,
        selectedHike,
        setFilters,
        setSelectedHike
    } = getHikesInfo();

    if (isLoading) return <Spin size="large"/>;

    return (

        <Layout style={{minHeight: '100vh'}}>
            <Header/>

            <Layout hasSider>
                <Sidebar
                    hikes={hikes}
                    filterOptions={filterOptions}
                    filters={filters}
                    selectedHike={selectedHike}
                    onFiltersChange={setFilters}
                    onSelectHike={setSelectedHike}
                />


            </Layout>
        </Layout>
    );
};

export default HomePage;