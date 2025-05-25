import React from 'react';
import {Space, Tag, Typography} from 'antd';
import Card from 'antd/es/card/Card';
import {Hike} from "../../../../types/hike.ts";
import dayjs from 'dayjs';

const {Text, Title} = Typography;

interface HikeItemProps {
    hike: Hike;
    isSelected: boolean;
    onClick: (hike: Hike) => void;
}


export const HikeItem: React.FC<HikeItemProps> = React.memo(({hike, isSelected, onClick}) => {
    const formatDateRange = (start: string, end: string) => {
        return `${dayjs(start).format('DD.MM.YYYY')} - ${dayjs(end).format('DD.MM.YYYY')}`;
    };

    return (
        <Card
            onClick={() => onClick(hike)}
            style={{
                borderColor: isSelected ? '#1890ff' : '#f0f0f0',
                cursor: 'pointer',
                transition: 'border-color 0.3s',
            }}
            bodyStyle={{
                padding: 16
            }}
        >
            <Space direction="vertical" size={0}>
                <Title level={5} style={{margin: 0}}>{hike.title}</Title>
                <Space direction="vertical" size={0}>
                    <Text>{formatDateRange(hike.startDate, hike.endDate)}</Text>
                    <Text type="secondary">Организатор: {hike.organizer}</Text>
                    <Space size={0}>
                        <Tag>{hike.area}</Tag>
                        <Tag>Кат. {hike.difficulty}</Tag>
                        <Tag>{hike.hikeType}</Tag>
                    </Space>
                </Space>
            </Space>
        </Card>
    );
});