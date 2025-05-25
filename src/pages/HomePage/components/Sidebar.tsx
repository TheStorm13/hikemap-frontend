import  {useState} from 'react';
import {HikeTypes} from '../../../types/hike.types.ts';
import {FilterOptions} from '../../../types/FilterOptions.ts';
import {HikeFilters} from '../../../types/HikeFilters.ts';
import {Button, Drawer, Input, Layout, Menu, Typography} from 'antd';
import {Filter} from './Filter.tsx';
import {FilterOutlined, SearchOutlined} from "@ant-design/icons";

const {Sider} = Layout;
const {Text} = Typography;

interface SidebarProps {
    hikes: HikeTypes[];
    filterOptions: FilterOptions;
    filters: HikeFilters;
    selectedHike: HikeTypes | null;
    onFiltersChange: (filters: HikeFilters) => void;
    onSelectHike: (hike: HikeTypes) => void;
}

export const Sidebar = ({
                            hikes,
                            filterOptions,
                            filters,
                            selectedHike,
                            onFiltersChange,
                            onSelectHike
                        }: SidebarProps) => {
    const [isFilterDrawerVisible, setFilterDrawerVisible] = useState(false);

    const toggleFilterDrawer = () => {
        setFilterDrawerVisible(!isFilterDrawerVisible);
    };

    return (
        <>
            <Sider
                width={350}
                style={{
                    background: '#fff',
                    borderRight: '1px solid #f0f0f0',
                    overflow: 'auto',
                    height: 'calc(100vh - 64px)',
                    position: 'sticky',
                    top: 64,
                    left: 0,
                    padding: 16,
                }}
            >
                <Input
                    placeholder="Поиск походов"
                    prefix={<SearchOutlined/>}
                    allowClear
                    onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
                    style={{marginBottom: '16px'}}
                />
                <Button
                    icon={<FilterOutlined/>}
                    type="primary"
                    onClick={toggleFilterDrawer}
                >
                    Открыть фильтры
                </Button>
                <Button
                    icon={<FilterOutlined/>}
                    type="primary"
                    onClick={toggleFilterDrawer}
                >
                    Сортировать
                </Button>

                {/* Количество найденных походов */}
                <Text style={{display: 'block', margin: '16px 0', fontWeight: 500}}>
                    Найдено походов: {hikes.length}
                </Text>

                <Menu
                    mode="inline"
                    selectedKeys={selectedHike ? [selectedHike.id.toString()] : []}
                    style={{
                        borderRight: 0,
                        fontSize: '14px',
                        fontWeight: 500,
                    }}
                    items={hikes.map(hike => ({
                        key: hike.id.toString(),
                        label: (
                            <div
                                style={{
                                    padding: '12px 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    wordWrap: 'break-word', // Перенос длинных слов
                                    whiteSpace: 'normal',  // Разрешить перенос строк
                                }}
                            >
                                <div style={{fontWeight: 600, color: '#333'}}>{hike.title}</div>
                                <div style={{fontSize: '12px', color: '#888'}}>
                                    {new Date(hike.startDate).toLocaleDateString()} • {hike.area} •
                                    Категория {hike.difficulty}
                                </div>
                                {hike.isCategorical && (
                                    <span style={{fontSize: '12px', color: '#1890ff'}}>Категорийный</span>
                                )}
                            </div>
                        ),
                        onClick: () => onSelectHike(hike),
                    }))}
                />
            </Sider>

            <Drawer
                title="Фильтры"
                placement="left"
                onClose={toggleFilterDrawer}
                open={isFilterDrawerVisible}
                width={350}
            >
                <Filter
                    filters={filters}
                    filterOptions={filterOptions}
                    onFiltersChange={onFiltersChange}
                />
            </Drawer>
        </>
    );
};