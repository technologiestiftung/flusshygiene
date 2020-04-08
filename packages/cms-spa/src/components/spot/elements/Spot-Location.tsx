import React from "react";
import { IconMapPin } from "../../fontawesome-icons";
export interface ISpotBodyLocation {
  children?: React.ReactNode;
  nameLong?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  website?: string;
  location?: any;
  name: string;
}

export const SpotLocation: React.FC<ISpotBodyLocation> = (props) => {
  return (
    <>
      <h3 className="is-title is-3">
        <span>
          <IconMapPin></IconMapPin>
        </span>{" "}
        <span>Anschrift</span>
      </h3>
      <div className="content">
        <p>{props.nameLong !== undefined ? props.nameLong : props.name}</p>
        <p>{props.street}</p>
        <p>
          {props.postalCode} {props.city}
        </p>
        {(() => {
          if (
            props.website !== null &&
            props.website !== undefined &&
            props.website.length > 0
          ) {
            // const reg = /^(http|https?)\:\/\//g;
            return (
              <p>
                <a href={`${props.website}`}>
                  {props.website
                    .replace(/^https?:\/\//g, "")
                    .replace(/\/$/, "")}
                </a>
              </p>
            );
          }
          return null;
        })()}
        {props.location?.coordinates !== undefined && (
          <p>
            <a
              data-testid="google-link"
              href={`https://maps.google.com/maps?daddr=${props.location.coordinates[1]},${props.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Route Berechnen mit Google Maps ->
            </a>
          </p>
        )}
      </div>
    </>
  );
};
