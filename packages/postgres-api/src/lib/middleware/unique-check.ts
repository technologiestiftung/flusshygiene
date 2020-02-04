import { middlewareFunc /*HttpCodes*/ } from '../common';
// import { responder } from '../request-handlers/responders';
// import { unique } from '../utils/unique-values';

export const uniqueCheck: middlewareFunc = async (
  _request,
  _response,
  next,
) => {
  throw new Error('dont use it now');
  // const body = request.body;
  // let isUnique = false;
  // if (Array.isArray(body) === true) {
  //   const uniquedData = unique(body, 'date');
  //   if (uniquedData.length === body.length) {
  //     isUnique = true;
  //   }
  // }
  // if (isUnique === false) {
  //   responder(response, HttpCodes.badRequestConflict, {
  //     message: 'The values you are sending are not unique by their date',
  //     success: false,
  //   });
  // } else {
  next();
  // }
};
