import React from 'react';
import { IObject } from '../../lib/common/interfaces';

/**
 * @property {boolean} cyanoPossible
 * @property {boolean} lifeguard
 * @property {boolean} disabilityAccess
 * @property {boolean} hasDisabilityAccesableEntrence
 * @property {boolean} restaurant
 * @property {boolean} snack
 * @property {boolean} parkingSpots
 * @property {boolean} bathrooms
 * @property {boolean} disabilityAccessBathrooms
 * @property {boolean} bathroomsMobile
 * @property {boolean} dogban
 */
export interface ISpotBodyAddonList {
  [key: string]: any;
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

export interface ISpotBodyAddonListItem {
  image: string;
  text: string;
}

/*
cyano  possivble  = cyanoPossible
wasserrettung  durch = waterRescueThroughDLRGorASB || waterRescue
rettungschwimmer  = lifeguard
barrierefrei  = disabilityAccess
barrierefrei  zugang = disabilityAccessBathrooms
restaurant  = restaurant
imbiss  = snack
parken  = parkingSpots
wc  = bathrooms
wc  barrierefrei = disabilityAccessBathrooms
wc  mobile = bathroomsMobile
hundeverbot   = dogban

*/

const data: IObject = {
  bathrooms: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  bathroomsMobile: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  cyanoPossible: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  disabilityAccess: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  disabilityAccessBathrooms: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  dogban: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  hasDisabilityAccesableEntrence: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  lifeguard: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  parkingSpots: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  restaurant: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  snack: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
  waterRescue: {
    no: { image: 'https://via.placeholder.com/32', text: 'no' },
    yes: { image: 'https://via.placeholder.com/32', text: 'yes' },
  },
};

const SpotBodyAddonListItem = (props: ISpotBodyAddonListItem) => {
  return (
    <li>
      <img src={`${props.image}`} alt={`${props.text}`} />
      {props.text}
    </li>
  );
};

export const SpotBodyAddonList = (props: ISpotBodyAddonList) => (
  <ul>
    {Object.keys(props).map((key: string, i: number) => {
      if (props.hasOwnProperty(key) === true) {
        return (
          props[key] !== undefined && (
            <SpotBodyAddonListItem
              key={i}
              image={
                props[key] === true ? data[key].yes.image : data[key].no.image
              }
              text={`${key} === ${
                props[key] === true ? data[key].yes.text : data[key].no.text
              }`}
            />
          )
        );
      }
      return null;
    })}
  </ul>
);
