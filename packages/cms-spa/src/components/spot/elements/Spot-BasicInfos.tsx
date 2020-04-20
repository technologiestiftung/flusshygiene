import { IBathingspot } from "../../../lib/common/interfaces";
import { SpotImage } from "./Spot-Image";
import { SpotLocation } from "./Spot-Location";
import React from "react";
export function SpotBasicInfos(spot: IBathingspot): React.ReactNode {
  return (
    <>
      <div className="column is-5">
        <SpotLocation
          name={spot.name}
          nameLong={spot.nameLong}
          street={spot.street}
          location={spot.location}
          postalCode={(() => {
            if (spot.postalCode !== undefined && spot.postalCode !== null) {
              return `${spot.postalCode}`;
            }
            return "";
          })()}
          city={spot.city}
          website={spot.website}
        />
      </div>
      <div className="column is-5">
        <SpotImage
          image={spot.image}
          nameLong={spot.nameLong}
          name={spot.name}
          imageAuthor={undefined}
        />
      </div>
    </>
  );
}
