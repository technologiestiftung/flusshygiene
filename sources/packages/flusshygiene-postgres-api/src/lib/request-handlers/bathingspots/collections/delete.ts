import { HttpCodes, postResponse } from '../../../common';

import { collectionNames } from './collections';

import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../../responders';

import { getSpot } from '../../../utils/spot-repo-helpers';

import {
  collectionRepoMapping,
  getColletionItemById,
} from '../../../utils/collection-repo-helpers';

import { getRepository } from 'typeorm';

import { SUCCESS } from '../../../messages';

// delete

export const deleteCollectionSubItem: postResponse = async (
  request,
  response,
) => {
  try {
    const userId = parseInt(request.params.userId, 10);
    const spotId = parseInt(request.params.spotId, 10);
    const itemId = request.params.itemId;
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
