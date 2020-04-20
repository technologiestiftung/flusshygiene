import { middlewareFunc, HttpCodes } from '../common';
import { responder } from '../request-handlers/responders';
import { collectionNames } from '../request-handlers/bathingspots/collections/collections';

export const collectionCheck: middlewareFunc = async (
  request,
  response,
  next,
) => {
  const collectionName = request.params.collectionName;
  if (collectionName === undefined) {
    responder(response, HttpCodes.badRequest, {
      message: 'missing collectionName',
      success: false,
    });
  }
  if (collectionNames.includes(collectionName) === false) {
    responder(response, HttpCodes.badRequest, {
      message: `"${collectionName}" not included in "${JSON.stringify(
        collectionNames,
      )}"`,
      success: false,
    });
  }
  response.locals.collectionName = collectionName;
  next();
};

export const collectionCheckPublic: middlewareFunc = async (
  request,
  response,
  next,
) => {
  const collectionName = request.params.collectionName;
  if (collectionName === undefined) {
    responder(response, HttpCodes.badRequest, {
      message: 'missing collectionName',
      success: false,
    });
    return;
  }
  if (collectionNames.includes(collectionName) === false) {
    responder(response, HttpCodes.badRequest, {
      message: `"${collectionName}" not included in "${JSON.stringify(
        collectionNames,
      )}"`,
      success: false,
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Collection Name Public Check', collectionName);
  if (
    collectionName === 'genericInputs' ||
    collectionName === 'purificationPlants'
  ) {
    responder(response, HttpCodes.badRequest, {
      message: `"${collectionName}" data is not public`,
      success: false,
    });
    return;
  }

  response.locals.collectionName = collectionName;
  next();
};
