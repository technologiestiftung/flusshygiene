import { Rain } from '../../../orm/entity/Rain';
import { GenericInput } from '../../../orm/entity/GenericInput';
import { BathingspotModel } from '../../../orm/entity/BathingspotModel';
import { BathingspotMeasurement } from '../../../orm/entity/BathingspotMeasurement';
import { BathingspotPrediction } from '../../../orm/entity/BathingspotPrediction';
import { getResponse, HttpCodes, postResponse, IObject } from '../../common';
import { responder, responderWrongId, successResponse, errorResponse } from '../responders';
import { getSpot, getSpotWithRelation } from '../../utils/spot-repo-helpers';
import { getRepository } from 'typeorm';
import { PurificationPlant, GlobalIrradiance, Discharge, Bathingspot } from '../../../orm/entity';

const collectionNames = [
  'predictions',
  'measurements',
  'purificationPlants',
  'models',
  'genericInputs',
  'globalIrradiances',
  'discharges',
  'rains'
];

const collectionRepoMapping: IObject = {
  'predictions': 'BathingspotPrediction',
  'measurements': 'BathingspotMeasurement',
  'purificationPlants': 'PurificationPlant',
  'models': 'BathingspotModel',
  'genericInputs': 'GenericInput',
  'globalIrradiances': 'GlobalIrradiance',
  'discharges': 'Discharge',
  'rains': 'Rain'
};
/**
 * A generic function for getting alll kinds of collections like Rain, BathingspotMeasurement, Predictions,
 *
 */
export const getCollection: getResponse = async (request, response) => {
  try {
    const userId = request.params.userId;
    const spotId = request.params.spotId;
    const collectionId = request.params.collection;
    if (collectionNames.includes(collectionId) === false) {
      responder(
        response,
        HttpCodes.badRequest, { success: false, message: `"${collectionId}" not included in "${JSON.stringify(collectionNames)}"` });
    } else {

      const spot = await getSpot(userId, spotId);// await query.getOne();
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        const spotWithRelation = await getSpotWithRelation(spot.id, collectionId);// await query.getOne();
        if (spotWithRelation === undefined) {
          throw new Error(`Spot with id ${spot.id} could not be loaded even though it exists`);
        } else {
          const entityObj = JSON.parse(JSON.stringify(spotWithRelation));
          responder(response,
            HttpCodes.success,
            successResponse(`spot ${spotId} with ${collectionId}`, entityObj[collectionId]));
        }
      }
    }

  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
}



export const postCollection: postResponse = async (request, response) => {
  try {

    const userId = request.params.userId;
    const spotId = request.params.spotId;
    const collectionId: string = request.params.collection;
    if (collectionNames.includes(collectionId) === false) {
      responder(
        response,
        HttpCodes.badRequest, { success: false, message: `"${collectionId}" not included in "${JSON.stringify(collectionNames)}"` });
    } else {
      const spot = await getSpot(userId, spotId);
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        const repoName = collectionRepoMapping[collectionId];
        const repo: any = getRepository(repoName);
        const entity = repo.create();
        const mergedEntity:
          BathingspotPrediction |
          BathingspotMeasurement |
          PurificationPlant |
          BathingspotModel |
          GenericInput |
          GlobalIrradiance |
          Rain
          = repo.merge(entity, request.body);
        const spotWithRelation = await getSpotWithRelation(spot.id, collectionId);
        if (spotWithRelation === undefined) {
          throw new Error('Could not load Bathingspot with relation "prediction" even though it exists');
        } else {
          switch (collectionId) {
            case 'predictions':
              {
                const mEntity = mergedEntity as BathingspotPrediction;
                if (spotWithRelation.predictions === undefined) {
                  spotWithRelation.predictions = [mEntity];
                } else {
                  spotWithRelation.predictions.push(mEntity);
                }
              };
              break
            case 'measurements':
              {
                const mEntity = mergedEntity as BathingspotMeasurement;
                if (spotWithRelation.measurements === undefined) {
                  spotWithRelation.measurements = [mEntity];
                } else {
                  spotWithRelation.measurements.push(mEntity);
                }
              }
              break;
            case 'purificationPlants':
              {
                const mEntity = mergedEntity as PurificationPlant;
                if (spotWithRelation.purificationPlants === undefined) {
                  spotWithRelation.purificationPlants = [mEntity];
                } else {
                  spotWithRelation.purificationPlants.push(mEntity);
                }
              }
              break;
            case 'models':
              {
                const mEntity = mergedEntity as BathingspotModel;
                if (spotWithRelation.models === undefined) {
                  spotWithRelation.models = [mEntity];
                } else {
                  spotWithRelation.models.push(mEntity);
                }
              }
              break;
            case 'genericInputs':
              {
                const mEntity = mergedEntity as GenericInput;
                if (spotWithRelation.genericInputs === undefined) {
                  spotWithRelation.genericInputs = [mEntity];
                } else {
                  spotWithRelation.genericInputs.push(mEntity);
                }
              }
              break;
            case 'globalIrradiances':
              {
                const mEntity = mergedEntity as GlobalIrradiance;
                if (spotWithRelation.globalIrradiances === undefined) {
                  spotWithRelation.globalIrradiances = [mEntity];
                } else {
                  spotWithRelation.globalIrradiances.push(mEntity);
                }
              }
              break;
            case 'discharges':
              {
                const mEntity = mergedEntity as Discharge;
                if (spotWithRelation.discharges === undefined) {
                  spotWithRelation.discharges = [mEntity];
                } else {
                  spotWithRelation.discharges.push(mEntity);
                }
              }
              break;
            case 'rains':
              {
                const mEntity = mergedEntity as Rain;
                if (spotWithRelation.rains === undefined) {
                  spotWithRelation.rains = [mEntity];
                } else {
                  spotWithRelation.rains.push(mEntity);
                }
              }
              break;
          }
          await repo.save(mergedEntity);
          await getRepository(Bathingspot).save(spotWithRelation);
          responder(response,
            HttpCodes.successCreated,
            successResponse(`${repoName} Posted`, [mergedEntity]));
        }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
}

