import { getCustomRepository } from 'typeorm';
import { Bathingspot, criteriaBathingspot, geomCriteria } from '../../orm/entity/Bathingspot';
import { Region } from '../../orm/entity/Region';
import { BathingspotRepository } from '../repositories/BathingspotRepository';
import { RegionRepository } from '../repositories/RegionRepository';
import { IObject } from '../common';
import { BathingspotMeasurement } from './../../orm/entity/BathingspotMeasurement';

import { BathingspotPrediction } from './../../orm/entity/BathingspotPrediction';
import { AddEntitiesToSpot } from '../common';
import { isObject } from './is-object';

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

const setupGeom: (obj: { value: any, criterion: any }) => any = (obj) => {
  let res: object | undefined;

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
  criteriaBathingspot.forEach(criterion => {
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

// const isPrediction = (entity: BathingspotMeasurement|BathingspotPrediction): entity is BathingspotPrediction {
//   return (<BathingspotPrediction>entity).prediction !== undefined;
// }

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

// used in app.ts for setup
export const addEntitiesToSpot: AddEntitiesToSpot = async (options) => {
  try {
    const spotRepo = getCustomRepository(BathingspotRepository);
    for (const entity of options.entities) {
      const fOpts = { where: {} };

      switch (true) {
        case entity instanceof BathingspotMeasurement:
          fOpts.where = {
            detailId: (entity as BathingspotMeasurement).detailId,
          };
          break;
        case entity instanceof BathingspotPrediction:
          // console.log('case is prediction');

          fOpts.where = {
            oldId: (entity as BathingspotPrediction).oldId,
          };
          break;
      }

      const bspot = await spotRepo.findOne(fOpts);

      if (bspot !== undefined) {
        if (entity instanceof BathingspotPrediction) {
          // console.log('got prediction');
          if (bspot.predictions === undefined) {
            bspot.predictions = [entity];
          } else {
            bspot.predictions.push(entity);
          }

        } else if (entity instanceof BathingspotMeasurement) {
          if (bspot.measurements === undefined) {
            bspot.measurements = [entity];
          } else {
            bspot.measurements.push(entity);
          }
        }
        // const spot =  await spotRepo.findById(bspot.id);
        // if(spot !== undefined){
        //   entity.bathingspot = spot;
        // }
        await options.connection.manager.save(entity);
        await options.connection.manager.save(bspot);
      }
    }
  } catch (error) {
    throw error;
  }
};
