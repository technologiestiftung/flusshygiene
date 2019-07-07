import { validate, ValidationError } from 'class-validator';
import { getRepository, QueryFailedError } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { User } from '../../../orm/entity/User';
import { HttpCodes, postResponse } from '../../common';
// import { getEntityFields } from '../../utils/get-entity-fields';
import { errorResponse, responder, responderSuccessCreated } from '../responders';
import { getRegionsList } from '../../utils/region-repo-helpers';

//  █████╗ ██████╗ ██████╗
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██║  ██║██║  ██║
// ██╔══██║██║  ██║██║  ██║
// ██║  ██║██████╔╝██████╔╝
// ╚═╝  ╚═╝╚═════╝ ╚═════╝

const createUser = async (obj: any) => {
  const userRepo = getRepository('user');// getCustomRepository(UserRepository);

  const user: User = new User();
  userRepo.merge(user, obj);
  try {
    const errors = await validate(user);
    if (errors.length > 0) {
      // const msgs = errors.map(e => e.constraints);
      // throw new Error(`User validation failed ${JSON.stringify(msgs, null, 2)}`);
      return errors;
    } else {
      // console.log(user);
      return user;
    }
  } catch (e) {
    throw e;
  }
};
// const checkRequiredFileds: (obj: IObject) => boolean = (obj) => {
//   const fields = ['role', 'firstName', 'lastName', 'email'];
//   const res: boolean[] = [];

//   fields.forEach(field => {
//     res.push(obj.hasOwnProperty(field));
//   });
//   if (res.includes(false)) {
//     return false;
//   } else {
//     return true;
//   }
// };

export const postUser: postResponse = async (request, response) => {
  try {
    const userRepo = getRepository('user');
    // console.log(request.body);

    const result = await createUser(request.body);
    if (Array.isArray(result) === true) {
      // console.log(result);
      responder(response, HttpCodes.badRequestNotFound, errorResponse(result as ValidationError[]));
    } else {
      const user = result as User;
      let region: Region | undefined;
      const regionsList = await getRegionsList();
      // console.log(regionsList);
      if (request.body.region !== undefined) {
        // console.log('has region');
        if (regionsList.includes(request.body.region) === true) {
          // console.log('found region');
          region = await getRepository(Region).findOne({ where: { name: request.body.region } });
          user.regions = [region!];
        }
      }
      // console.log(user.regions);
        const res = await userRepo.save(user);
      responderSuccessCreated(response, 'User was created', [res]);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      responder(response, HttpCodes.badRequestNotFound, errorResponse(error));
    } else if(error instanceof QueryFailedError){
      responder(response, HttpCodes.badRequestNotFound, errorResponse(error));
    }else {
      responder(response, HttpCodes.internalError, errorResponse(error));
    }
  }
}

/**
 * @deprecated
 * rewrite because overly complicated
 */
// export const addUser: postResponse = async (request, response) => {
//   try {
//     const list = await getRegionsList();
//     const example = await getEntityFields('User');
//     const hasRequiredFields = checkRequiredFileds(request.body);
//     if (hasRequiredFields === true) {
//       if (request.body.role === UserRole.creator &&
//         (request.body.hasOwnProperty('region') === true &&
//           list.includes(request.body.region) === true)
//       ) {
//         const region = await getRepository(Region).findOne({ where: { name: request.body.region } });
//         const user = await createUser(request.body);
//         if (region instanceof Region) {
//           user.regions = [region];
//         }
//         const res = await getRepository(User).save(user); // .save(user);
//         responderSuccessCreated(response, 'User was created', [res]);

//       } else if ((request.body.hasOwnProperty('role') === true && request.body.role === UserRole.reporter)) {
//         const user = await createUser(request.body);
//         const res = await getRepository(User).save(user); // .save(user);
//         responderSuccessCreated(response, 'User was created', [res]);
//       } else {
//         responderMissingBodyValue(response, example);
//       }
//     } else {
//       responderMissingBodyValue(response, example);

//     }
//   } catch (e) {
//     responder(response, HttpCodes.internalError, errorResponse(e));
//   }
// };
