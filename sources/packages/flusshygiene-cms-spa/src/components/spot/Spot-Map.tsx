import React from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { IMapsProps, IBathingspot } from '../../lib/common/interfaces';
import { DEFAULT_SPOT_ID } from '../../lib/common/constants';
import { StaticMap } from 'react-map-gl';
import { REACT_APP_MAPBOX_API_TOKEN } from '../../lib/config';

const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

const SpotsMap: React.FC<IMapsProps> = ({
  width,
  height,
  data,
  zoom,
  lat,
  lon,
}) => {
  if (zoom !== undefined) {
    initialViewState.zoom = zoom;
    if (
      data !== undefined &&
      data[0] !== undefined &&
      lat !== undefined &&
      lon !== undefined
    ) {
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
      {(() => {
        if (
          data !== undefined &&
          data[0] !== undefined &&
          data[0].id !== DEFAULT_SPOT_ID
        ) {
          const spots: IBathingspot[] = data as IBathingspot[];
          const filteredSpots = spots.filter((d) => {
            if (d.location === null || d.location === undefined) {
              // console.log(d);
              return null;
            } else {
              return d;
            }
          });

          return (
            <ScatterplotLayer
              id={'scatterplot'}
              data={filteredSpots}
              filled={true}
              getFillColor={(_d: IBathingspot) => [255, 140, 0]}
              getLineColor={(_d: IBathingspot) => [0, 0, 0]}
              getPosition={(d: IBathingspot) => {
                if (d.location === null) {
                  return;
                }
                if (
                  d.location !== undefined &&
                  d.location.coordinates !== undefined
                ) {
                  return [d.location.coordinates[0], d.location.coordinates[1]];
                }
              }}
              getRadius={100}
              lineWidthMinPixels={1}
              opacity={0.8}
              pickable={true}
              radiusMaxPixels={100}
              radiusMinPixels={1}
              radiusScale={6}
              stroked={true}
            />
          );
        }
      })()}

      <StaticMap
        width={width}
        height={height}
        mapboxApiAccessToken={REACT_APP_MAPBOX_API_TOKEN}
      />
    </DeckGL>
  );
};

export default SpotsMap;
