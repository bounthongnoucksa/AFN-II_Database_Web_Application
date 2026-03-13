//frontend/src/components/MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { projects } from '../MapGPSdata'; // Importing the GPS data for projects
import L from 'leaflet';
import '../Mapview.css'; // Import custom CSS for map styling and legend

//To hightlight the boundary of Laos, we can use GeoJSON data and the GeoJSON component from react-leaflet
import laoBoundary from '../assets/GeoJSON/lao_boundary.json';
//import laoBoundary from '../assets/GeoJSON/lao_boundary_with_regions.json';
import { GeoJSON } from 'react-leaflet';

//Import custom marker icons
import greenIconUrl from '../assets/markers/marker-icon-green.png';
import redIconUrl from '../assets/markers/marker-icon-red.png';
import blueIconUrl from '../assets/markers/marker-icon-blue.png';
import orangeIconUrl from '../assets/markers/marker-icon-orange.png';
import violetIconUrl from '../assets/markers/marker-icon-violet.png';
import yellowIconUrl from '../assets/markers/marker-icon-yellow.png';
import goldIconUrl from '../assets/markers/marker-icon-gold.png';
import shadowIconUrl from '../assets/markers/marker-shadow.png';


//auto focus on the map using Laos boundary GeoJSON data
import { useMap } from 'react-leaflet';

const FitLaosBounds = ({ geojson }) => {
    const map = useMap();
    map.fitBounds(L.geoJSON(geojson).getBounds());
    return null;
};

// Optional: custom marker icons for different project types
const greenIcon = new L.Icon({
    iconUrl: greenIconUrl,
    shadowUrl: shadowIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: redIconUrl,
    shadowUrl: shadowIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
    iconUrl: blueIconUrl,
    shadowUrl: shadowIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapView = () => {
    return (
        <div className="d-flex" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '710px' }}>
            {/* Left column: Header + Buttons */}
            <div style={{ width: '300px', overflowY: 'auto', padding: '10px' }}>
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="text-center w-100">
                        <div className="fw-bold fs-5">GeoM&E</div>
                        <div className="text-muted" style={{ fontSize: '14px' }}>Utilizing GIS mapping to accurately identify project areas, visualise project results and strengthen monitoring and evaluation</div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-center flex-wrap">
                        <button className='btn btn-primary btn-sm me-2' style={{ width: '200px' }} > Change map theme</button>
                        {/* <button className='btn btn-primary btn-sm me-2' style={{ width: '120px' }} >Load new data</button>
                        <button className='btn btn-primary btn-sm me-2' style={{ width: '120px' }}  >Export</button> */}
                    </div>
                </div>
            </div>

            {/* Right column: Map panel */}
            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                <div>
                    <MapContainer
                        style={{ height: '75vh', width: '100%' }}
                        minZoom={6}
                        maxZoom={18}
                        //Not allows users to pan outside of Laos
                        maxBounds={[
                            [6, 92],   // southwest (further south-west)
                            [30, 115],  // northeast (further north-east)
                        ]}
                    >
                        {/* Tile Layer for Lao language */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Tile Layer for Lao English
                        1️⃣ Carto Light (Bright / minimal) */}
                        {/* <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        /> */}

                        {/* Tile Layer for Lao English
                        2️⃣ Carto Voyager (Colorful / modern) */}
                        {/* <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        /> */}



                        {/* Tile Layer for Lao English
                        3️⃣ Stamen Toner Lite (Minimal / high contrast) */}
                        {/* <TileLayer
                            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png"
                        /> */}

                        {/* Tile Layer for Lao English
                        4️⃣ OpenStreetMap HOT (Humanitarian / lightly colored) */}
                        {/* <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                        /> */}

                        {/* Tile Layer for Lao English
                        5️⃣ Esri World Street Map (Polished / full English labels) */}
                        {/* <TileLayer
                            attribution='Tiles &copy; Esri &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        /> */}

                        {/* Highlight Laos */}
                        <GeoJSON
                            data={laoBoundary}
                            style={{
                                color: '#2502eb',       // border color (orange)
                                weight: 1,              // border thickness
                                fillColor: '#00ff73',   // light yellow fill
                                fillOpacity: 0.07        // semi-transparent
                            }}
                        />

                        {/* Auto-fit map to Laos */}
                        <FitLaosBounds geojson={laoBoundary} />

                        {/* Render projects */}
                        {projects.map(project => {
                            const type = project.type.toLowerCase();

                            const infrastructureTypes = [
                                'infrastructure',
                                'drying floor',
                                'collection center',
                                'grinding mill',
                                'dryer',
                                'mill',
                                'thresher',
                                'sorter',
                                'cooling system',
                                'packing unit',
                                'weighing station'
                            ];

                            const roadTypes = ['road', 'access tracks'];

                            let icon;

                            if (infrastructureTypes.includes(type)) {
                                icon = greenIcon;
                            } else if (type === 'warehouse') {
                                icon = blueIcon;
                            } else {
                                icon = redIcon;
                            }

                            if (roadTypes.includes(type)) {
                                return (
                                    <React.Fragment key={project.id}>
                                        <Polyline positions={project.gps} pathOptions={{ color: 'red', weight: 4, opacity: 1 }}
                                        >
                                            <Popup>
                                                <strong>{project.name}</strong><br />
                                                {project.address} <br />
                                                Length: {project.length} km
                                            </Popup>
                                        </Polyline>

                                        <Marker position={project.gps[0]} icon={redIcon}>
                                            <Popup>
                                                <strong>{project.name}</strong><br />
                                                {project.address} <br />
                                                Length: {project.length} km
                                            </Popup>
                                        </Marker>
                                    </React.Fragment>
                                );
                            }

                            return (
                                <Marker key={project.id} position={project.gps} icon={icon}>
                                    <Popup>
                                        <strong>{project.name}</strong><br />
                                        {project.address}
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* Legend */}
                        <div className="map-legend">
                            <h4>Map Legend</h4>
                            <div className="legend-item">
                                <img src={greenIconUrl} alt="Infrastructure" /> Infrastructure
                            </div>
                            <div className="legend-item">
                                <img src={redIconUrl} alt="Road" /> Access Track/Road
                            </div>
                            {/* <div className="legend-item">
                                <img src={blueIconUrl} alt="Other" /> Others
                            </div> */}
                        </div>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapView;