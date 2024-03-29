import React, { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './geo';
import { dataRegions } from './data';
import './App.css';
import Select from 'react-select';
// const center = [47.654444, 57.9340307];

var polygon = statesData
export default function App() {
  const [isFirstSelected, setIsSelected] = useState(true);
  const [selectValue, setSelectValue] = useState(0);
  const [selectValue2, setSelectValue2] = useState(0);
  // const [isSelectActive, setIsSelectActive] = useState(0);
  const [mapCenter, setMapCenter ] = useState([47.654444, 57.9340307]);

  // Мемо для того, чтобы функция не запускалась при
  // каждом ререндере

  const geoObjects = useMemo(
    () =>
      statesData.features.map((state) => ({
        value: state.properties.GID_1,
        label: state.properties.NAME_1,
      })),
    []
  );
 
  // console.log(geoObjects);
  // Мемо для того, чтобы функция не запускалась при
  // каждом ререндере, а только при изменении selectValue (области)
  const geoObjects2 = useMemo(
    () =>
      dataRegions.features
        .filter((state) => state.properties.GID_1 === selectValue)
        .map((state) => {
          const geoNames2 = state.properties.NAME_2;

          return geoNames2;
        }),
    [selectValue]
  );

  console.log(geoObjects2);

  const newGeoArr = () =>
    geoObjects
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((item) => ({
        value: item,
        label: item,
      }));

  const newGeoArr2 = () =>
    geoObjects2
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((item) => ({
        value: item,
        label: item,
      }));

  // useCallback для оптимизации, чтобы функция не
  // генерилась при каждом ререндере
  const checkFillColor = useCallback(
    (state, region) => {
      if (selectValue2 === region) {
        return 'green';
      }
      if (selectValue !== 0) {
        return " transparent";
      }
      if (selectValue === state) {
        return 'red';
      }
      else{
        return "#FD8D3C";
      }
    },
    [selectValue, selectValue2]
  );

  const selectChange = () => {
    if (selectValue2.length > 0) {
      console.log("1")
      polygon = dataRegions
      return true;
    }
    else {
      console.log("0")
      return false;
    }
  };

  const changeRegion = (value) => {
    setIsSelected(false);
    setSelectValue(value);
    // setSelectValue2(value);
  };
  console.log(selectValue2);

  const selectCenter = (center) => {
  //   () =>
  //   dataRegions.features.map((state) => ({
  //     value: state.properties.GID_1,
  //     label: state.properties.NAME_1,
  //   })),
  // []
  };
  return (
    <div className="map-main-container">
      <Select
        options={geoObjects}
        defaultValue={selectValue}
        className="custom-select"
        onChange={({ value }) => {
          changeRegion(value);
        }}
      />
      <Select
        // value={colored}
        isDisabled={isFirstSelected}
        options={newGeoArr2()}
        className="custom-select"
        onChange={({ value }) => {setSelectValue2(value);
        selectChange(false);
        // isSelectActive(true);
        selectCenter(true);
        }}
      />
      <MapContainer className="map-container" 
        center={mapCenter} 
        zoom={5} 
        onChange={({center}) => selectCenter(center)} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { polygon.features.map((state, index) => {
          const coordinates = state.geometry.coordinates[0].map((item) => [
            item[1],
            item[0],
          ]);
          <Marker position={mapCenter} />;
          return (
            <Polygon
            key={index}
            pathOptions={{
              fillColor: checkFillColor(
                state?.properties.GID_1,
                state?.properties.NAME_2
              ),
                // color: isSelectActive ? 'white' : '',
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,

              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    dashArray: '',
                    fillColor:'#BD0026',
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                    color: '',
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: '3',
                    color: '',
                    fillColor: checkFillColor(
                      state?.properties.GID_1,
                      state?.properties.NAME_2
                    ),
                  });
                },
                click: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: '3',
                    color: 'white',
                  //fillColor: 'white',
                  });
                },
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
