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
  PurificationPlant,
  Rain,
} from '../../../orm/entity';
import { getResponse, HttpCodes, postResponse } from '../../common';
import { SUCCESS } from '../../messages';
import {
  collectionRepoMapping,
  getColletionItemById,
  getGIWithRelations,
  getPPlantWithRelations,
} from '../../utils/collection-repo-helpers';
import { getSpot, getSpotWithRelation } from '../../utils/spot-repo-helpers';
import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../responders';

const collectionNames = [
  'predictions',
  'measurements',
  'purificationPlants',
  'models',
  'genericInputs',
  'globalIrradiances',
  'discharges',
  'rains',
];

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

export const getGenericInputMeasurements: getResponse = async (
  request,
  response,
) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const itemId = request.params.itemId;
    const collectionName = request.params.collectionName;
    const allowedRepos = ['genericInputs', 'purificationPlants'];
    const repoName = collectionRepoMapping[collectionName];

    if (allowedRepos.includes(collectionName) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionName}" not included in "${JSON.stringify(
          allowedRepos,
        )}"`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId);
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        let collection: GenericInput | PurificationPlant | undefined;
        switch (repoName) {
          case 'GenericInput':
            collection = await getGIWithRelations(itemId);
            break;
          case 'PurificationPlant':
            collection = await getPPlantWithRelations(itemId);
            break;
        }
        if (collection === undefined) {
          responderWrongId(response);
        } else {
          responder(
            response,
            HttpCodes.success,
            successResponse(
              `${repoName} measurements.`,
              collection.measurements,
            ),
          );
        }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

/**
 * @todo There is no saveguard that checks if we have the right spot and the right user. Needs to be addressed
 */
export const getCollectionsSubItem: getResponse = async (request, response) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const itemId = request.params.itemId;
    const collectionName = request.params.collectionName;
    if (collectionNames.includes(collectionName) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionName}" not included in "${JSON.stringify(
          collectionNames,
        )}"`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId);
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        const repoName = collectionRepoMapping[request.params.collectionName];
        const collection = await getColletionItemById(itemId, repoName);
        if (collection === undefined) {
          responderWrongId(response);
        } else {
          responder(
            response,
            HttpCodes.success,
            successResponse(`${itemId} from ${collectionName}`, [collection]),
          );
        }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

/**
 * A generic function for getting alll kinds
 * of collections like Rain, BathingspotMeasurement,
 * Predictions, Also Used for PPlants and GenericInputs.
 * Not the values though
 *
 */
export const getCollection: getResponse = async (request, response) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const collectionId = request.params.collection;
    if (collectionNames.includes(collectionId) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionId}" not included in "${JSON.stringify(
          collectionNames,
        )}"`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId); // await query.getOne();
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        const spotWithRelation = await getSpotWithRelation(
          spot.id,
          collectionId,
        ); // await query.getOne();
        if (spotWithRelation === undefined) {
          throw new Error(
            `Spot with id ${spot.id} could not be loaded even though it exists`,
          );
        } else {
          const entityObj = JSON.parse(JSON.stringify(spotWithRelation));
          responder(
            response,
            HttpCodes.success,
            successResponse(
              `spot ${spotId} with ${collectionId}`,
              entityObj[collectionId],
            ),
          );
        }
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
    const collectionId: string = request.params.collection;
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
          > = [];
          const mergedEntities: Array<
            | BathingspotPrediction
            | BathingspotMeasurement
            | PurificationPlant
            | BathingspotModel
            | GenericInput
            | GlobalIrradiance
            | Rain
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
              | Rain = repo.merge(entity, datum);

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

// delete

export const deleteCollectionSubItem: postResponse = async (
  request,
  response,
) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const itemId = request.params.itemId;
    const collectionId = request.params.collection;
    if (collectionNames.includes(collectionId) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionId}" not included in "${JSON.stringify(
          collectionNames,
        )}"`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId); // await query.getOne();
      if (spot === undefined) {
        responderWrongId(response);
      } else {
        const repoName = collectionRepoMapping[collectionId];
        const repo: any = getRepository(repoName);
        const entity = await getColletionItemById(itemId, repoName);
        if (entity !== undefined) {
          const res = await repo.remove(entity);
          responder(
            response,
            HttpCodes.success,
            successResponse(SUCCESS.successDelete200, [res]),
          );
        } else {
          // console.log(entity);
          responderWrongId(response);
        }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
// put
