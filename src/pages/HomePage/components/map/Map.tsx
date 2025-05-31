import React, { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layout } from 'antd';
import { GeoJsonFeature } from '../../../api/TrackApi';

interface MapProps {
    tracks: GeoJsonFeature[];
    selectedHikeId: number | null;
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

export const Map: React.FC<MapProps> = ({ tracks, selectedHikeId, style }) => {
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
                mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
            }
        }
    }, [tracks]);

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
                {tracks.map((track) =>
                    track?.geometry?.coordinates?.length > 0 ? (
                        <GeoJSON
                            key={`track-${track.id}`}
                            data={trackToGeoJSON(track)}
                            style={{
                                color: selectedHikeId === track.id ? '#ff0000' : '#3388ff',
                                weight: selectedHikeId === track.id ? 5 : 3
                            }}
                        />
                    ) : null
                )}
            </MapContainer>
        </Layout>
    );
};