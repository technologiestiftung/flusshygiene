import { getRepository } from 'typeorm';
import { IObject } from '../lib/common';
import { isObject } from '../lib/utils/is-object';
import { findByName } from '../lib/utils/region-repo-helpers';
import { Region } from '../orm/entity';
import { Bathingspot, criteriaBathingspot } from '../orm/entity/Bathingspot';

// const allowedFeatureTypes = ['Point', 'Polygon'];

// const checkGeom: (obj: any) => boolean = (obj) => {
//   const res: boolean[] = [];
//   geomCriteria.forEach((criterion) => {
//     if (obj.hasOwnProperty(criterion.key) === true) {
//       switch (criterion.type) {
//         case 'array':
//           res.push(Array.isArray(obj[criterion.key]));
//           break;
//         case 'string':
//           res.push(allowedFeatureTypes.includes(obj[criterion.key]));
//           break;
//       }
//     }
//   });
//   return res.includes(false) || res.length > 2 ? false : true;
// };

const setupGeom: (obj: { value: any; criterion: any }) => any = (obj) => {
  let res: object | undefined;

  if (isObject(obj.value) === true) {
    if (obj.value.hasOwnProperty('coordinates') === true) {
      // if (checkGeom(obj.value.geometry) === true) {
      const geom = { [obj.criterion.key]: obj.value.coordinates };
      res = geom;
      // }
    }
  }
  return res;
};
export const createSpotWithValues = async (
  providedValues: IObject,
): Promise<Bathingspot> => {
  const spotRepo = getRepository(Bathingspot);
  const spot = new Bathingspot();
  criteriaBathingspot.forEach((criterion) => {
    const value = providedValues[criterion.key];
    const obj = { [criterion.key]: value };
    switch (criterion.type) {
      case 'object':
        if (isObject(value)) {
          spotRepo.merge(spot, obj);
        }
        break;
      case 'geometry':
        const geom = setupGeom({ value, criterion });
        // console.log('this is geom', geom);
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
  try {
    let region: Region | undefined;
    if (obj.hasOwnProperty('region') === true) {
      region = await findByName(obj.region);
      if (region instanceof Region) {
        return region;
      }
    }
    return region;
  } catch (error) {
    throw error;
  }
};
