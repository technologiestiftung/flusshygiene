import { getCustomRepository } from 'typeorm';
import { Bathingspot } from '../../orm/entity/Bathingspot';
import { Region } from '../../orm/entity/Region';
import { BathingspotRepository } from '../repositories/BathingspotRepository';
import { RegionRepository } from '../repositories/RegionRepository';
import { IObject } from '../types-interfaces';
import { isObject } from './is-object';

const criteria = [
  { type: 'object', key: 'apiEndpoints' },
  { type: 'object', key: 'state' },
  { type: 'number', key: 'latitude' },
  { type: 'number', key: 'longitude' },
  { type: 'number', key: 'elevation' },
  { type: 'string', key: 'name' },
  { type: 'boolean', key: 'isPublic' },
  { type: 'boolean', key: 'isPublic' },
  { type: 'geometry', key: 'area' },
  { type: 'geometry', key: 'location' },
];

const geomCriteria = [
  {type: 'string', key: 'type'},
  {type: 'array', key: 'coordinates'},
];

const allowedFeatureTypes = ['Point', 'Polygon'];

const checkGeom: (obj: any) => boolean = (obj) => {
  const res: boolean[] = [];
  geomCriteria.forEach(criterion => {
    if (obj.hasOwnProperty(criterion.key) === true) {
      switch (criterion.type) {
        case 'array':
        res.push(Array.isArray(obj[criterion.key]));
        break;
        case 'string':
        res.push(allowedFeatureTypes.includes(obj[criterion.key]));
        break;
      }
    }
  });
  return res.includes(false) || res.length > 2 ? false : true;
};

const setupGeom: (obj: {value: any, criterion: any}) => any = (obj) => {
  let res: object|undefined;

  if (isObject(obj.value) === true) {
    if (obj.value.hasOwnProperty('geometry') === true) {
      if (checkGeom(obj.value.geometry) === true) {
          const geom = { [obj.criterion.key]: obj.value.geometry };
          res = geom;
        }
      }
    }
  return res;
};
export const createSpotWithValues = async (providedValues: IObject): Promise<Bathingspot> => {
  const spotRepo = getCustomRepository(BathingspotRepository);
  const spot = new Bathingspot();
  criteria.forEach(criterion => {
    const value = providedValues[criterion.key];
    const obj = { [criterion.key]: value };
    switch (criterion.type) {
      case 'object':
      if (isObject(value)) {
        spotRepo.merge(spot, obj);
      }
      break;
      case 'geometry':
      const geom = setupGeom({value, criterion});
      if (geom !== undefined) {
        spotRepo.merge(spot, geom);
      }
      // if (isObject(value) === true) {
      //   if (value.hasOwnProperty('geometry') === true) {
      //     if (checkGeom(value.geometry) === true) {
      //         const geom = { [criterion.key]: value.geometry };
      //         spotRepo.merge(spot, geom);
      //       }
      //     }
      //   }
      break;
      default:
        if (typeof value === criterion.type) {
          spotRepo.merge(spot, obj);
        }
        break;
    }
  });

  const region = await getAndVerifyRegion(providedValues);
  if (region instanceof Region) {
    spot.region = region;
  }
  return spot;
};

const getAndVerifyRegion = async (obj: any) => {
  const regionRepo = getCustomRepository(RegionRepository);
  try {
    let region: Region | undefined;
    if (obj.hasOwnProperty('region') === true) {
      region = await regionRepo.findByName(obj.region);
      if (region instanceof Region) {
        return region;
      }
    }
    return region;
  } catch (error) {
    throw error;
  }
};
