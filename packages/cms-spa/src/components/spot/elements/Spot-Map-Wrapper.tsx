import { IBathingspot } from "../../../lib/common/interfaces";
import React from "react";
import SpotsMap from "./Spot-Map";
export const MapWrapper: React.FC<{
  mapDims: {
    width: number;
    height: number;
  };
  spot: IBathingspot;
}> = ({ mapDims, spot }) => {
  return (
    // <div ref={mapRef} id='map__container'>
    <SpotsMap
      width={mapDims.width}
      height={mapDims.height}
      data={(() => {
        return Array.isArray(spot) === true ? spot : [spot];
      })()}
      zoom={4}
    />
  );
};
// export function MapWrapper(
//   mapRef: React.RefObject<HTMLDivElement>,
//   mapDims: {
//     width: number;
//     height: number;
//   },
//   spot: IBathingspot,
// ): React.ReactNode {
//   // console.log('mapwrapper');

// }
