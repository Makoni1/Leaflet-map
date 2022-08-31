import React from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './data';
import './App.css';
import Select from 'react-select';
const center = [47.654444, 57.9340307];

export default function App() {
  // const [selectValue, setSelectValue] = useState(' ');
  const geoObjects = statesData.features.map((state) => {
    const geoNames = state.properties.NAME_2;

    return geoNames;
  });
  // console.log(geoObjects);
  const newGeoArr = () => {
    const geoNamesOptions = [];
    geoObjects.map((item) => {
      geoNamesOptions.push({ value: item, label: item });
    });

    return geoNamesOptions;
  };

  return (
    <div className="map-main-container">
      <Select options={newGeoArr()} className="custom-select" />
      <MapContainer className="map-container" center={center} zoom={5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {statesData.features.map((state) => {
          const coordinates = state.geometry.coordinates[0].map((item) => [
            item[1],
            item[0],
          ]);
          <Marker position={center} />;

          return (
            <Polygon
              pathOptions={{
                fillColor: '#FD8D3C',
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,
                color: 'white',
              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    dashArray: '',
                    fillColor: '#BD0026',
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: '3',
                    color: 'white',
                    fillColor: '#FD8D3C',
                  });
                },
                // click: (e) => {
                //   console.log(state.properties.NAME_2);
                //   const layer = e.target;
                //   layer.setStyle({
                //     fillOpacity: 0.7,
                //     weight: 2,
                //     dashArray: "3",
                //     color: "white",
                //     fillColor: "white",
                //   });
                // },
              }}
            >
              <Popup>{state.properties.NAME_2}</Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
