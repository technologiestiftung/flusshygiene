import React from 'react';
import { SpotAddonTag } from './SpotAddonTag';

export interface ISpotBodyAddon {
  cyanoPossible?: boolean;
  lifeguard?: boolean;
  disabilityAccess?: boolean;
  hasDisabilityAccesableEntrence?: boolean;
  restaurant?: boolean;
  snack?: boolean;
  parkingSpots?: boolean;
  bathrooms?: boolean;
  disabilityAccessBathrooms?: boolean;
  bathroomsMobile?: boolean;
  dogban?: boolean;
}

const keyTextMapping = {
  bathrooms: 'Waschräume',
  bathroomsMobile: 'Mobile Waschräume',
  cyanoPossible: 'Cyanobakterien möglich',
  disabilityAccess: 'Barrierefrei',
  disabilityAccessBathrooms: 'Barrierefreie Waschräume',
  dogban: 'Hundeverbot',
  hasDisabilityAccesableEntrence: 'Barrierefreier Eingang',
  lifeguard: 'Rettungschwimmer',
  parkingSpots: 'Parkplätze',
  restaurant: 'Restaurant',
  snack: 'Imbiss',
  waterRescue: 'Wasserrettung',
};

export const SpotBodyAddonTagGroup: React.FC<ISpotBodyAddon> = (props) => {
  return (
    <div className='field is-grouped is-grouped-multiline'>
      {Object.keys(props).map((key: string, i: number) => {
        // console.log(key);
        if (props.hasOwnProperty(key) === true) {
          return (
            props[key] !== undefined && (
              <SpotAddonTag
                text={keyTextMapping[key]}
                status={props[key]}
                key={i}
              />
            )
          );
        }
        return null;
      })}
    </div>
  );
};
