import React, {useCallback} from 'react';
import {Button, DatePicker, Input, Layout, Select, Space, Typography} from 'antd';
import {FilterOutlined, SearchOutlined} from '@ant-design/icons';
import {Hike} from '../../../types/hike';
import {HikeFilters} from '../../../types/HikeFilters.ts';
import {HikeList} from "./listHike/HikeList.tsx";

const {Sider} = Layout;
const {RangePicker} = DatePicker;
const {Title} = Typography;
const {Option} = Select;

interface SidebarProps {
    hikes: Hike[];
    filters: HikeFilters;
    isFiltersVisible: boolean;
    selectedHike: Hike | null;
    onFiltersChange: (filters: HikeFilters) => void;
    onSelectHike: (hike: Hike) => void;
    onToggleFilters: () => void;
}


export const Sidebar: React.FC<SidebarProps> = React.memo(({
                                                               hikes,
                                                               filters,
                                                               isFiltersVisible,
                                                               selectedHike,
                                                               onFiltersChange,
                                                               onSelectHike,
                                                               onToggleFilters,
                                                           }) => {
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onFiltersChange({...filters, search: e.target.value});
        },
        [filters, onFiltersChange]
    );
    const handleSortChange = (value: string) => {
        onFiltersChange({...filters, sortBy: value});
    };

    const sortedHikes = React.useMemo(() => {
        if (!filters.sortBy) return hikes;

        return [...hikes].sort((a, b) => {
            switch (filters.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'startDate':
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                case 'difficulty':
                    return Number(a.difficulty) - Number(b.difficulty);
                default:
                    return 0;
            }
        });
    }, [hikes, filters.sortBy]);


    return (
        <Sider
            width={350}
            collapsedWidth={0}
            trigger={null}
            collapsible={false}
            breakpoint="md"
            style={{
                backgroundColor: '#fff', // Белый фон
                padding: 16, // Общие отступы
            }}
        >
            <Input
                placeholder="Поиск по названию"
                prefix={<SearchOutlined/>}
                allowClear
                onChange={handleSearchChange}
                value={filters.search || ''}
                style={{marginBottom: 16}}
            />
            <Space direction="horizontal" size={16}>
                <Button
                    icon={<FilterOutlined />}
                    type={isFiltersVisible ? 'primary' : 'default'}
                    onClick={onToggleFilters}
                    style={{ marginBottom: 16 }}
                >
                    Фильтры
                </Button>

                <Select
                    style={{width: '100%', marginBottom: 16}}
                    placeholder="Сортировать по"
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    allowClear

                >
                    <Option value="title">Алфавиту</Option>
                    <Option value="startDate">Дате начала</Option>
                    <Option value="difficulty">Сложности</Option>
                </Select>
            </Space>

            <HikeList
                hikes={sortedHikes}
                selectedHike={selectedHike}
                onSelectHike={onSelectHike}
            />
        </Sider>
    );
});

Sidebar.displayName = 'Sidebar';