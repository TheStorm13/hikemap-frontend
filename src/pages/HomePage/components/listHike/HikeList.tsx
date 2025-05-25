import React from 'react';
import {Typography} from 'antd';
import {HikeItem} from './HikeItem';
import {Hike} from "../../../../types/hike.ts";

const {Text} = Typography;

interface HikeListProps {
    hikes: Hike[];
    selectedHike: Hike | null;
    onSelectHike: (hike: Hike) => void;
}

export const HikeList: React.FC<HikeListProps> = React.memo(({
                                                                 hikes,
                                                                 selectedHike,
                                                                 onSelectHike,
                                                             }) => {
    return (
        <>

            <Text strong style={{display: 'block', marginBottom: 16}}>
                Найдено походов: {hikes.length}
            </Text>

            <div style={{display: 'flex', flexDirection: 'column', rowGap: '16px', columnGap: '8px'}}>
                {hikes.map(hike => (
                    <HikeItem
                        key={hike.id}
                        hike={hike}
                        isSelected={selectedHike?.id === hike.id}
                        onClick={onSelectHike}
                    />
                ))}
            </div>
        </>
    );
});