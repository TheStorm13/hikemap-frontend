import React from 'react';
import {Button, Checkbox, DatePicker, Select} from 'antd';
import {HikeFilters} from '../../../types/HikeFilters.ts';
import {FilterOptions} from '../../../types/FilterOptions.ts';
import {Dayjs} from 'dayjs';

const {RangePicker} = DatePicker;
const {Option} = Select;

interface FilterProps {
    filters: HikeFilters;
    filterOptions: FilterOptions;
    onFiltersChange: (filters: HikeFilters) => void;
}

export const Filter: React.FC<FilterProps> = ({filters, filterOptions, onFiltersChange}) => {
    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        onFiltersChange({
            ...filters,
            startDateFrom: dates?.[0]?.format('YYYY-MM-DD'),
            startDateTo: dates?.[1]?.format('YYYY-MM-DD')
        });
    };

    return (
        <div style={{padding: '16px'}}>
            <RangePicker
                style={{width: '100%', marginBottom: '16px'}}
                onChange={handleDateChange}
            />

            <Select
                placeholder="Сложность"
                style={{width: '100%', marginBottom: '16px'}}
                allowClear
                onChange={(value) => onFiltersChange({...filters, difficulty: value})}
            >
                {filterOptions.difficulties.map((d: number) => (
                    <Option key={d} value={d}>{`Уровень ${d}`}</Option>
                ))}
            </Select>

            <Select
                placeholder="Регион"
                style={{width: '100%', marginBottom: '16px'}}
                allowClear
                onChange={(value) => onFiltersChange({...filters, areaId: value})}
            >
                {filterOptions.areas.map((area: string) => (
                    <Option key={area} value={area}>{area}</Option>
                ))}
            </Select>

            <Select
                placeholder="Тип похода"
                style={{width: '100%', marginBottom: '16px'}}
                allowClear
                onChange={(value) => onFiltersChange({...filters, hikeTypeId: value})}
            >
                {filterOptions.hikeTypes.map((type: string) => (
                    <Option key={type} value={type}>{type}</Option>
                ))}
            </Select>

            <Select
                placeholder="Организатор"
                style={{width: '100%', marginBottom: '16px'}}
                allowClear
                onChange={(value) => onFiltersChange({...filters, organizerId: value})}
            >
                {filterOptions.organizers.map((org: string) => (
                    <Option key={org} value={org}>{org}</Option>
                ))}
            </Select>

            <Checkbox
                checked={filters.isCategorical}
                onChange={(e) => onFiltersChange({...filters, isCategorical: e.target.checked})}
                style={{marginBottom: '16px'}}
            >
                Только категорийные
            </Checkbox>

            <Button
                type="default"
                block
                onClick={() => onFiltersChange({})}
            >
                Сбросить фильтры
            </Button>
        </div>
    );
};