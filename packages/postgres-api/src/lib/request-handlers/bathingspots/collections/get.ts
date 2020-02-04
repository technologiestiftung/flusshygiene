import { getResponse, HttpCodes } from '../../../common';

import {
  collectionRepoMapping,
  getColletionItemById,
  getPPlantWithRelations,
  getGIWithRelations,
} from '../../../utils/collection-repo-helpers';

import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../../responders';

import { getSpot, getSpotWithRelation } from '../../../utils/spot-repo-helpers';

import { GenericInput, PurificationPlant } from '../../../../orm/entity';
import { collectionNames } from './collections';

export const getGenericInputMeasurements: getResponse = async (
  request,
  response,
) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const itemId = request.params.itemId;
    const subItemId = parseInt(request.params.subItemId, 10);
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
        // console.log('collection', collection);
        if (collection === undefined) {
          responderWrongId(response);
        } else {
          let res: any = [];
          if (subItemId !== undefined && isNaN(subItemId) === false) {
            collection.measurements.forEach((elem: any) => {
              if (elem.id === subItemId) {
                res.push(elem);
              }
            });
          } else {
            res = collection.measurements;
          }

          responder(
            response,
            HttpCodes.success,
            successResponse(`${repoName} measurements.`, res),
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
      return;
    } else {
      const spot = await getSpot(userId, spotId);
      if (spot === undefined) {
        responderWrongId(response);
        return;
      } else {
        const repoName = collectionRepoMapping[request.params.collectionName];
        const collection = await getColletionItemById(itemId, repoName);
        if (collection === undefined) {
          responderWrongId(response);
          return;
        } else {
          responder(
            response,
            HttpCodes.success,
            successResponse(`${itemId} from ${collectionName}`, [collection]),
          );
          return;
        }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
    return;
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
    const collectionId = request.params.collectionName;
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
        // if (spotWithRelation === undefined) {
        //   throw new Error(
        //     `Spot with id ${spot.id} could not be loaded even though it exists`,
        //   );
        // } else {
        const entityObj = JSON.parse(JSON.stringify(spotWithRelation));
        responder(
          response,
          HttpCodes.success,
          successResponse(
            `spot ${spotId} with ${collectionId}`,
            entityObj[collectionId],
          ),
        );
        // }
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

// export const getModelReport: getResponse = async (request, response) => {
//   try {
//     if (response.locals.spot === undefined) {
//       throw new Error('Middleware did not pass on Bathingspot data');
//     }
//     const collectionName = request.params.collectionName;
//     console.log(collectionName);
//     const itemId = parseInt(request.params.itemId, 10);
//     console.log('itemid', itemId);
//     // const report = await getRModelReportWithRelation(itemId);

//     response.json(response.locals.spot);
//   } catch (error) {
//     responder(response, HttpCodes.internalError, errorResponse(error));
//   }
// };
