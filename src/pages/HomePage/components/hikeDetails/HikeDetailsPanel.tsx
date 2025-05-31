import React, {useEffect, useState} from 'react';
import {useAuth} from "../../../../service/auth/AuthContext.tsx";
import {LikeApi} from "../../../../api/LikeApi.ts";
import {FileApi} from "../../../../api/FilesApi.ts";
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
    const {state} = useAuth();
    const likeApi = new LikeApi();
    const fileApi = new FileApi();


    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                console.log(`Статус перед отправкой лайка: ${state.status}`);
                const likedHikes = await likeApi.getLikedHikes();
                const isLiked = likedHikes.some(likedHike => likedHike.id === hike.id);
                setLiked(isLiked);
            } catch (error) {
                console.error('Ошибка при проверке лайков:', error);
            }
        };

        checkIfLiked();
    }, [hike.id]);

    const handleLike = async () => {
        try {
            await likeApi.likeHike(hike.id);
            setLiked(!liked); // Обновляем состояние после успешного запроса
        } catch (error) {
            console.error('Ошибка при отправке лайка:', error);
        }
    };

    const handleDownloadReport = async () => {
        try {
            await fileApi.downloadFile(hike.id, 'PDF');
        } catch (error) {
            console.error('Ошибка при скачивании отчета:', error);
        }
    };

    const handleDownloadTrack = async () => {
        try {
            await fileApi.downloadFile(hike.id, 'GPX');
        } catch (error) {
            console.error('Ошибка при скачивании трека:', error);
        }
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
                    type={liked ? 'primary' : 'default'}
                    danger={liked}
                    icon={<LikeOutlined/>}
                    onClick={handleLike}
                    disabled={state.status !== 'authenticated'} // Кнопка доступна только при авторизации
                >
                    Лайк
                </Button>
                <Button
                    icon={<DownloadOutlined/>}
                    onClick={handleDownloadReport}
                    disabled={!hike.reportPdfPath}

                >
                    Скачать отчет
                </Button>
                <Button
                    icon={<DownloadOutlined/>}
                    onClick={handleDownloadTrack}
                    disabled={!hike.trackGpxPath || hike.trackGpxPath.trim() === ''}
                >
                    Скачать трек
                </Button>
            </Space>
        </Card>
    );
});