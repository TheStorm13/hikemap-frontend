import React, {useEffect, useRef} from 'react';
import {GeoJSON, MapContainer, TileLayer} from 'react-leaflet';
import L from 'leaflet';
//@ts-ignore
import 'leaflet/dist/leaflet.css';
import {Layout} from 'antd';
import {GeoJsonFeature} from '../../../../api/TrackApi.ts';
import {Hike} from "../../../../types/hike.ts";

interface MapProps {
    hikes: Hike[];
    tracks: GeoJsonFeature[];
    selectedHikeId: number | null; // Изменено с Hike | null на number | null
    handleSelectHike: (hike: Hike | null) => void;
    style?: React.CSSProperties;
}

const trackToGeoJSON = (track: GeoJsonFeature): GeoJSON.Feature => ({
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: track.geometry.coordinates
    },
    properties: {
        ...track.properties,
        id: track.id
    }
});

export const Map: React.FC<MapProps> = ({hikes, tracks, selectedHikeId, handleSelectHike, style}) => {
    const mapRef = useRef<L.Map>(null);

    if (typeof window === 'undefined') return null;

    useEffect(() => {
        if (mapRef.current && tracks.length > 0) {
            const group = new L.FeatureGroup();

            tracks.forEach(track => {
                if (track?.geometry?.coordinates?.length > 0) {
                    const geoJson = L.geoJSON(trackToGeoJSON(track));
                    group.addLayer(geoJson);
                }
            });

            if (group.getLayers().length > 0) {
                mapRef.current.fitBounds(group.getBounds(), {padding: [50, 50]});
            }
        }
    }, [tracks]);

    const getHikeByTrackId = (trackId: number, hikes: Hike[]): Hike | undefined => {
        // Здесь нужно правильно связать trackId и hike.id
        // В текущей реализации просто ищем hike с таким же id как trackId
        return hikes.find(hike => hike.id === trackId);
    };

    handleSelectHike(hike || null); // Передаем объект Hike или null

    const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
        if (feature.properties && feature.properties.id) {
            layer.on('click', () => handleFeatureClick(feature.properties.id));
        }
    };

    return (
        <Layout hasSider style={{position: 'relative', flex: 1}}>
            <MapContainer
                ref={mapRef}
                center={[55.751244, 37.618423]}
                zoom={13}
                style={{height: '100%', width: '100%', ...style}}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {tracks.map((track) =>
                    track?.geometry?.coordinates?.length > 0 ? (
                        <GeoJSON
                            key={`track-${track.id}`}
                            data={trackToGeoJSON(track)}
                            style={{
                                color: selectedHikeId === track.id ? '#ff0000' : '#3388ff',
                                weight: selectedHikeId === track.id ? 5 : 3
                            }}
                            onEachFeature={onEachFeature}
                        />
                    ) : null
                )}
            </MapContainer>
        </Layout>
    );
};