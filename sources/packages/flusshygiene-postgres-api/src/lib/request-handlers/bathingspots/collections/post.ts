import { HttpCodes, postResponse } from '../../../common';

import { collectionNames } from './collections';

import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../../responders';

import { getSpot, getSpotWithRelation } from '../../../utils/spot-repo-helpers';

import {
  collectionRepoMapping,
  getGIWithRelations,
} from '../../../utils/collection-repo-helpers';

import { getRepository } from 'typeorm';

import {
  Bathingspot,
  BathingspotMeasurement,
  BathingspotModel,
  BathingspotPrediction,
  Discharge,
  GenericInput,
  GInputMeasurement,
  GlobalIrradiance,
  ImageFile,
  PurificationPlant,
  Rain,
} from '../../../../orm/entity';

export const postCollectionsSubItem: postResponse = async (
  request,
  response,
) => {
  try {
    // const repoName = collectionRepoMapping[request.params.collection];
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const collectionName = request.params.collectionName;
    const itemId = request.params.itemId;
    if (collectionNames.includes(collectionName) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionName}" not included in "${JSON.stringify(
          collectionNames,
        )}"`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId);

      const repoName = collectionRepoMapping[collectionName];
      const repoGenericInput = getRepository(GenericInput);
      const repoGInputMeasurement = getRepository(GInputMeasurement);
      const gi = await getGIWithRelations(itemId);
      if (spot === undefined || gi === undefined) {
        responderWrongId(response);
      } else {
        let inData: GInputMeasurement[] = [];
        const mergedEntities: GInputMeasurement[] = [];
        let mergedEntity: GInputMeasurement | undefined;
        if (Array.isArray(request.body) === false) {
          inData.push(request.body);
        } else {
          inData = request.body;
        }
        // const repo: any = getRepository(repoName);
        for (const datum of inData) {
          // let res;
          switch (repoName) {
            case 'GenericInput':
              const measurement = repoGInputMeasurement.create();
              mergedEntity = repoGInputMeasurement.merge(measurement, datum);
              if (gi.measurements === undefined) {
                gi.measurements = [];
              }
              // } else {
              gi.measurements.push(mergedEntity);
              // }
              await repoGenericInput.save(gi);
              mergedEntities.push(mergedEntity);
              break;
          }
        }

        const res = await repoGInputMeasurement.save(mergedEntities);
        responder(
          response,
          HttpCodes.successCreated,
          successResponse(`${repoName} measurement posted.`, res),
        );
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

export const postCollection: postResponse = async (request, response) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const collectionId: string = request.params.collectionName;
    if (collectionNames.includes(collectionId) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionId}" not included in "${JSON.stringify(
          collectionNames,
        )}"`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId);
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        const spotWithRelation = await getSpotWithRelation(
          spot.id,
          collectionId,
        );
        if (spotWithRelation === undefined) {
          throw new Error(
            `Could not load Bathingspot with relation ${collectionId} even though it exists`,
          );
        } else {
          // console.log('body', request.body);

          const repoName = collectionRepoMapping[collectionId];
          const repo: any = getRepository(repoName);

          let inData: Array<
            | BathingspotPrediction
            | BathingspotMeasurement
            | PurificationPlant
            | BathingspotModel
            | GenericInput
            | GlobalIrradiance
            | Rain
            | ImageFile
          > = [];
          const mergedEntities: Array<
            | BathingspotPrediction
            | BathingspotMeasurement
            | PurificationPlant
            | BathingspotModel
            | GenericInput
            | GlobalIrradiance
            | Rain
            | ImageFile
          > = [];

          if (Array.isArray(request.body) === false) {
            // console.log('got an array not an object');
            inData.push(request.body);
          } else {
            inData = request.body;
          }
          for (const datum of inData) {
            const entity = repo.create();
            const mergedEntity:
              | BathingspotPrediction
              | BathingspotMeasurement
              | PurificationPlant
              | BathingspotModel
              | GenericInput
              | GlobalIrradiance
              | Rain
              | ImageFile = repo.merge(entity, datum);

            switch (collectionId) {
              case 'predictions':
                {
                  const mEntity = mergedEntity as BathingspotPrediction;
                  if (spotWithRelation.predictions === undefined) {
                    spotWithRelation.predictions = [mEntity];
                  } else {
                    spotWithRelation.predictions.push(mEntity);
                  }
                }
                break;
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
              case 'images':
                {
                  const mEntity = mergedEntity as ImageFile;
                  if (spotWithRelation.images === undefined) {
                    spotWithRelation.images = [mEntity];
                  } else {
                    spotWithRelation.images.push(mEntity);
                  }
                }
                break;
            }
            mergedEntities.push(mergedEntity);
          }
          const res = await repo.save(mergedEntities);

          await getRepository(Bathingspot).save(spotWithRelation);
          responder(
            response,
            HttpCodes.successCreated,
            successResponse(`${repoName} Posted`, res),
          );
        }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
