import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { IMapsProps, IBathingspot } from "../../../lib/common/interfaces";
import { DEFAULT_SPOT_ID } from "../../../lib/common/constants";
import { StaticMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { REACT_APP_MAPBOX_API_TOKEN } from "../../../lib/config";
import history from "../../../lib/history";
import { RouteNames } from "../../../lib/common/enums";
import { Layer } from "@deck.gl/core";

const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

const HoverObject: React.FC<{
  message: string;
  pointer: number[];
}> = ({ message, pointer }) => {
  return (
    <div
      className="is-size-7"
      style={{
        position: "absolute",
        zIndex: 10,
        pointerEvents: "none",
        left: pointer[0],
        top: pointer[1],

        // display: 'inline-block',
      }}
    >
      <span
        style={{
          backgroundColor: "#ffffff",
          padding: "0.2rem 1rem 0.2rem 1rem",
          boxShadow: "1px 2px 1px rgba(51,51,102, .5)",
          // display: 'inline-block',
        }}
      >
        {message}
      </span>
    </div>
  );
};
const SpotsMap: React.FC<IMapsProps> = ({
  width,
  height,
  data,
  zoom,
  lat,
  lon,
}) => {
  // console.log('spotsmap');
  const [isHovered, setIsHovered] = useState(false);
  // const [hoverObject, setHoverObject] = useState<React.ReactNode>(undefined);
  const [hoverObjectPointer, setHoverObjectPointer] = useState<number[]>([]);
  const [hoverObjectMessage, setHoverObjectMessage] = useState("");
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
  const layers: Layer<any>[] = [];
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

    const layer = new ScatterplotLayer({
      id: "scatterplot",
      data: filteredSpots,
      filled: true,
      getFillColor: (_d: IBathingspot) => [51, 51, 102],
      getLineColor: (_d: IBathingspot) => [255, 255, 255],
      // @ts-ignore
      getPosition: (d: IBathingspot) => {
        if (d.location === null) {
          return;
        }
        if (d.location !== undefined && d.location.coordinates !== undefined) {
          return [d.location.coordinates[0], d.location.coordinates[1]];
        }
      },
      getRadius: 15,
      lineWidthMinPixels: 2,
      opacity: 0.5,
      pickable: true,
      radiusMaxPixels: 20,
      radiusMinPixels: 5,
      radiusScale: 6,
      stroked: true,
      onClick: (info) => {
        // console.log(info.object);
        // @ts-ignore
        history.push(`${RouteNames.bathingspot}/${info.object.id}`);
      },
      onHover: (info) => {
        if (info.object === undefined) {
          setIsHovered(false);
          return;
        }
        setIsHovered(true);
        //@ts-ignore
        setHoverObjectMessage(info.object.name);
        setHoverObjectPointer([info.x, info.y]);
        // console.log(info.object);
      },
    });
    layers.push(layer);
  }
  return (
    <>
      {isHovered && (
        <HoverObject
          message={hoverObjectMessage}
          pointer={hoverObjectPointer}
        />
      )}
      <DeckGL
        width={width}
        height={height}
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        effects={[]}
      >
        {/* {(() => {
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
                id={"scatterplot"}
                data={filteredSpots}
                filled={true}
                getFillColor={(_d: IBathingspot) => [51, 51, 102]}
                getLineColor={(_d: IBathingspot) => [255, 255, 255]}
                getPosition={(d: IBathingspot) => {
                  if (d.location === null) {
                    return;
                  }
                  if (
                    d.location !== undefined &&
                    d.location.coordinates !== undefined
                  ) {
                    return [
                      d.location.coordinates[0],
                      d.location.coordinates[1],
                    ];
                  }
                }}
                getRadius={15}
                lineWidthMinPixels={2}
                opacity={0.5}
                pickable={true}
                radiusMaxPixels={20}
                radiusMinPixels={5}
                radiusScale={6}
                stroked={true}
                onClick={(info) => {
                  // console.log(info.object);
                  history.push(`${RouteNames.bathingspot}/${info.object.id}`);
                }}
                onHover={(info) => {
                  if (info.object === undefined) {
                    setIsHovered(false);
                    return;
                  }
                  setIsHovered(true);
                  setHoverObjectMessage(info.object.name);
                  setHoverObjectPointer([info.x, info.y]);
                  // console.log(info.object);
                }}
              />
            );
          }
        })()} */}

        <StaticMap
          width={width}
          height={height}
          mapboxApiAccessToken={REACT_APP_MAPBOX_API_TOKEN}
          mapStyle="mapbox://styles/fmoronzirfas/ck21m3k446h8g1cp9zj67nw4m"
        />
      </DeckGL>
    </>
  );
};

export default SpotsMap;
