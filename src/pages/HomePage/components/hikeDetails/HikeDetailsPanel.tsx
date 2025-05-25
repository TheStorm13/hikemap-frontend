import React, {useState,useCallback} from 'react';
import {Button, Card, Divider, Space, Tag, Typography} from 'antd';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    DownloadOutlined,
    EnvironmentOutlined,
    FlagOutlined,
    LikeOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {Hike} from "../../../../types/hike.ts";

const {Title, Text} = Typography;

interface HikeDetailsProps {
    hike: Hike;
    onClose?: () => void;
}

export const HikeDetailsPanel: React.FC<HikeDetailsProps> = React.memo(({hike, onClose}) => {
    const [liked, setLiked] = useState(false);


    const handleLike = () => {
        setLiked(!liked);
    };

    const handleDownloadReport = () => {
        console.log('Скачать отчет');
    };

    const handleDownloadTrack = () => {
        console.log('Скачать трек');
    };

    return (
        <Card
            title={
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined/>}
                    onClick={onClose}
                >
                    Назад к списку
                </Button>
            }
            style={{
                margin: 16,
                position: 'initial',
                width: '25vw', // 1/4 ширины окна
                overflow: 'auto', // Прокрутка, если содержимое превышает maxHeight
        }}
        >
            <Title level={2}>{hike.title}</Title>

            <Space style={{marginBottom: '16px'}}>
                <Tag icon={<FlagOutlined/>} color="blue">
                    Категория {hike.difficulty}
                </Tag>
                {hike.isCategorical && (
                    <Tag color="green">Категорийный поход</Tag>
                )}
                <Tag color="orange">{hike.hikeType}</Tag>
            </Space>
            <Divider/>
            <Space direction="vertical" size={0}>
                <Text style={{margin: '0px'}}>
                    <CalendarOutlined/>
                    <Text strong> Даты: </Text>
                    <Text>{hike.startDate} - {hike.endDate}</Text>
                </Text>

                <Text style={{margin: '0px'}}>
                    <EnvironmentOutlined/>
                    <Text strong> Район: </Text>
                    <Text>{hike.area}</Text>
                </Text>

                <Text style={{margin: '0px'}}>
                    <TeamOutlined/>
                    <Text strong> Организатор: </Text>
                    <Text>{hike.organizer}</Text>
                </Text>
            </Space>

            <Divider/>
            <Space>
                <Button
                    type='default'
                    icon={<LikeOutlined/>}
                    onClick={handleLike}
                >
                     Лайк
                </Button>
                <Button
                    icon={<DownloadOutlined/>}
                    onClick={handleDownloadReport}
                >
                    Скачать отчет
                </Button>
                <Button
                    icon={<DownloadOutlined/>}
                    onClick={handleDownloadTrack}
                >
                    Скачать трек
                </Button>
            </Space>
        </Card>
    );
});