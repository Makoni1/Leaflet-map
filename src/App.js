import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "./geo";
import { dataRegions } from "./data";
import "./App.css";
import Select from "react-select";
const center = [47.654444, 57.9340307];

export default function App() {
  const [isFirstSelected, setIsSelected] = useState(true);
  const [selectValue, setSelectValue] = useState(0);
  const [selectValue2, setSelectValue2] = useState(0);

  // Мемо для того, чтобы функция не запускалась при
  // каждом ререндере

  const geoObjects = useMemo(
    () =>
      statesData.features.map((state) => {
        const geoNames = state.properties.NAME_1;

        return geoNames;
      }),
    []
  );


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

  console.log(newGeoArr2());
  // useCallback для оптимизации, чтобы функция не
  // генерилась при каждом ререндере
  const checkFillColor = useCallback(
    (state, region) => {
      if (selectValue2 === region) {
        return "green";
      }
      if (selectValue === state) {
        return "red";
      }
      return "#FD8D3C";
    },
    [selectValue, selectValue2]
  );

  return (
    <div className="map-main-container">
      <Select
        options={newGeoArr()}
        defaultValue={selectValue}
        className="custom-select"
        onChange={({ value }) => {
          setIsSelected(false);
          setSelectValue(value);
          setSelectValue2(0);
        }}
      />
      <Select
        isDisabled={isFirstSelected}
        options={newGeoArr2()}
        className="custom-select"
        onChange={({ value }) => setSelectValue2(value)}
      />
      <MapContainer className="map-container" center={center} zoom={5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {statesData.features.map((state, index) => {
          const coordinates = state.geometry.coordinates[0].map((item) => [
            item[1],
            item[0],
          ]);
          <Marker position={center} />;
          return (
            <Polygon
              key={index}
              pathOptions={{
                fillColor: checkFillColor(
                  state?.properties.NAME_1,
                  state?.properties?.NAME_2
                ),
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,
                color: "white",
              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    dashArray: "",
                    fillColor: "#BD0026",
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                    color: "white",
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: "3",
                    color: "white",
                    fillColor: checkFillColor(
                      state?.properties.NAME_1,
                      state?.properties?.NAME_2
                    ),
                  });
                },
                click: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: "3",
                    color: "white",
                    fillColor: "white",
                  });
                },
              }}
            >
              <Popup>{state.properties.NAME_1}</Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
