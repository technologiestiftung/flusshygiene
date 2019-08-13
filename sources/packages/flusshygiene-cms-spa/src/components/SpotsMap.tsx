import React from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { ScatterplotLayer } from '@deck.gl/layers';
// import { useSelector } from 'react-redux';
// import { RootState } from '../lib/state/reducers/root-reducer';
// const MAPBOX_ACCESS_TOKEN = 'MAPBOX_ACCESS_TOKEN';
const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

const SpotsMap: React.FC<{
  width: number;
  height: number;
  data: any[];
  zoom?: number;
  lat?: number;
  lon?: number;
}> = ({ width, height, data, zoom, lat, lon }) => {
  // console.log(data);
  if (zoom !== undefined) {
    initialViewState.zoom = zoom;
    if (data[0] !== undefined && lat !== undefined && lon !== undefined) {
      initialViewState.latitude = data[0].latitude;
      initialViewState.longitude = data[0].longitude;
    }
  }
  return (
    <DeckGL
      width={width}
      height={height}
      initialViewState={initialViewState}
      controller={true}
    >
      <ScatterplotLayer
        id={'scatterplot'}
        data={data}
        filled={true}
        getFillColor={(_d: any) => [255, 140, 0]}
        getLineColor={(_d: any) => [0, 0, 0]}
        getPosition={(d: any) => [d.latitude, d.longitude]}
        getRadius={100}
        lineWidthMinPixels={1}
        opacity={0.8}
        pickable={true}
        radiusMaxPixels={100}
        radiusMinPixels={1}
        radiusScale={6}
        stroked={true}
      />
      <StaticMap
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
        width={width}
        height={height}
      />
    </DeckGL>
  );
};

export default SpotsMap;
