// import { Bathingspot } from '../../orm/entity/Bathingspot';
// import { getRepository } from 'typeorm';
// import { errorResponse } from './response-builders';
// import { getResponse, HttpCodes } from '../types-interfaces';


// /**
//  * Todo: Which properties should be returned
//  */
// export const getPublicBathingspots: getResponse = async (_request, response) => {
//   let spots: Bathingspot[];
//   try {
//     spots = await getRepository(Bathingspot).find(
//       {
//         where: { isPublic: true },
//         select: ['name']
//       }
//     );
//     response.status(HttpCodes.success).json(spots);
//   } catch (e) {
//     response.status(HttpCodes.internalError).json(errorResponse(e));
//   }
// }
