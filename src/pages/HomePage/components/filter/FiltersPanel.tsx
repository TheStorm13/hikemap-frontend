import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, Checkbox, CheckboxChangeEvent, DatePicker, Select, Space, Typography} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {FilterOptions, HikeFilters} from '../../../../types/hike.types.ts';
import dayjs from 'dayjs';


const {RangePicker} = DatePicker;
const {Title} = Typography;
const {Option} = Select;

interface FiltersPanelProps {
    filters: HikeFilters;
    filterOptions: FilterOptions;
    onFiltersChange: (filters: HikeFilters) => void;
    onClose: () => void;

}

export const FiltersPanel: React.FC<FiltersPanelProps> = React.memo(({
                                                                         filters,
                                                                         filterOptions,
                                                                         onFiltersChange,
                                                                         onClose,
                                                                     }) => {
    const [localFilters, setLocalFilters] = useState<HikeFilters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleDateChange = useCallback((dateStrings: [string, string]) => {
        setLocalFilters(prev => ({
            ...prev,
            startDateFrom: dateStrings[0],
            startDateTo: dateStrings[1],
        }));
    }, []);

    const handleSelectChange = useCallback((key: keyof HikeFilters) => (value: string) => {
        setLocalFilters(prev => ({...prev, [key]: value}));
    }, []);

    const handleDifficultyChange = useCallback((value: number) => {
        setLocalFilters(prev => ({...prev, difficulty: value}));
    }, []);

    const handleCategoricalChange = useCallback((e: CheckboxChangeEvent) => {
        setLocalFilters(prev => ({...prev, isCategorical: e.target.checked}));
    }, []);

    const clearFilters = (e: React.MouseEvent) => {
        e.preventDefault();
        const clearedFilters = {
            search: filters.search,
        };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const applyFilters = (e: React.MouseEvent) => {
        e.preventDefault();
        onFiltersChange(localFilters);
    };


    return (
        <Card
            title={
                <Space style={{justifyContent: 'space-between', width: '100%'}}>
                    <span>Фильтры</span>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                    />
                </Space>
            }
            style={{
                position: 'initial',
                margin: 16,
                width: '25vw', // 1/4 ширины окна
                maxHeight: '60vh', // Динамическая высота
                overflow: 'auto', // Прокрутка, если содержимое превышает maxHeight
            }}
        >

            <Title level={5} style={{margin: 8}}>Даты похода</Title>
            <RangePicker
                style={{width: '100%'}}
                onChange={handleDateChange}
                value={[
                    localFilters.startDateFrom ? dayjs(localFilters.startDateFrom) : null,
                    localFilters.startDateTo ? dayjs(localFilters.startDateTo) : null,
                ]}
                format="DD.MM.YYYY"
            />

            <Title level={5} style={{margin: 8}}>Район похода</Title>
            <Select
                style={{width: '100%'}}
                placeholder="Все районы"
                value={localFilters.area}
                onChange={handleSelectChange('area')}
                allowClear
            >
                {filterOptions.areas.map(area => (
                    <Option key={area} value={area}>{area}</Option>
                ))}
            </Select>

            <Title level={5} style={{margin: 8}}>Тип похода</Title>
            <Select
                style={{width: '100%'}}
                placeholder="Все типы"
                value={localFilters.hikeType}
                onChange={handleSelectChange('hikeType')}
                allowClear
            >
                {filterOptions.hikeTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                ))}
            </Select>

            <Title level={5} style={{margin: 8}}>Сложность</Title>
            <Select
                style={{width: '100%'}}
                placeholder="Любая сложность"
                value={localFilters.difficulty}
                onChange={handleDifficultyChange}
                allowClear
            >
                {filterOptions.difficulties.map(difficulty => (
                    <Option key={difficulty} value={difficulty}>{difficulty}</Option>
                ))}
            </Select>

            <Title level={5} style={{margin: 8}}>Организаторы</Title>
            <Select
                style={{width: '100%'}}
                placeholder="Все организаторы"
                value={localFilters.organizer}
                onChange={handleSelectChange('organizer')}
                allowClear
            >
                {filterOptions.organizers.map(org => (
                    <Option key={org} value={org}>{org}</Option>
                ))}
            </Select>

            <Checkbox
                checked={localFilters.isCategorical}
                onChange={handleCategoricalChange}
            >
                Только категорийные
            </Checkbox>

            <Space style={{width: '100%', justifyContent: 'flex-end'}}>
                <Button type="default" onClick={clearFilters}>
                    Сбросить
                </Button>
                <Button type="primary" onClick={applyFilters}>
                    Применить
                </Button>
            </Space>
        </Card>
    );
});