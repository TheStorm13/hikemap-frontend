import React, { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layout } from 'antd';

interface MapProps {
    tracks: any[];
    selectedHikeId: number | null;
    style?: React.CSSProperties;
}

const trackToGeoJSON = (track: any) => ({
    type: 'Feature',
    geometry: track.route,
    properties: track.properties || {}
});

export const Map: React.FC<MapProps> = ({ tracks, selectedHikeId, style }) => {
    const mapRef = useRef<L.Map>(null);

    // Проверка доступности window (для SSR)
    if (typeof window === 'undefined') {
        return null;
    }

    useEffect(() => {
        if (mapRef.current && tracks.length > 0) {
            // Создаем группу слоев для всех треков
            const group = new L.FeatureGroup();

            tracks.forEach(track => {
                if (track?.route?.coordinates?.length > 0) {
                    const geoJson = L.geoJSON(trackToGeoJSON(track));
                    group.addLayer(geoJson);
                }
            });

            // Если в группе есть слои, фитим карту по ним
            if (group.getLayers().length > 0) {
                mapRef.current.fitBounds(group.getBounds(), {
                    padding: [50, 50] // Добавляем немного отступов
                });
            }
        }
    }, [tracks]); // Эффект срабатывает при изменении tracks

    return (
        <Layout hasSider style={{ position: 'relative', flex: 1 }}>
            <MapContainer
                ref={mapRef}
                center={[55.751244, 37.618423]}
                zoom={13}
                style={{ height: '100%', width: '100%', ...style }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {tracks.map(track => (
                    track?.route?.coordinates?.length > 0 && (
                        <GeoJSON
                            key={track.id}
                            data={trackToGeoJSON(track)}
                            style={{
                                color: selectedHikeId !== null && track.id === selectedHikeId ? '#ff0000' : '#3388ff',
                                weight: selectedHikeId !== null && track.id === selectedHikeId ? 5 : 3
                            }}
                        />
                    )
                ))}
            </MapContainer>
        </Layout>
    );
};