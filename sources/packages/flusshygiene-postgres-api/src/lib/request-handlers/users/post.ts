import { validate } from 'class-validator';
import { getCustomRepository, getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { User } from '../../../orm/entity/User';
import { getRegionsList } from '../../repositories/custom-repo-helpers';
import { UserRepository } from '../../repositories/UserRepository';
import { HttpCodes, IObject, postResponse, UserRole } from '../../types-interfaces';
import { getEntityFields } from '../../utils/get-entity-fields';
import { errorResponse, responder, responderMissingBodyValue, responderSuccessCreated } from '../responders';

//  █████╗ ██████╗ ██████╗
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██║  ██║██║  ██║
// ██╔══██║██║  ██║██║  ██║
// ██║  ██║██████╔╝██████╔╝
// ╚═╝  ╚═╝╚═════╝ ╚═════╝

const createUser = async (obj: any) => {
  const userRepo = getCustomRepository(UserRepository);
  const user: User = new User();
  userRepo.merge(user, obj);
  try {
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(`User validation failed ${JSON.stringify(errors)}`);
    }
    return user;
  } catch (e) {
    throw e;
  }
};
const checkRequiredFileds: (obj: IObject) => boolean = (obj) => {
  const fields = ['role', 'firstName', 'lastName', 'email'];
  const res: boolean[] = [];

  fields.forEach(field => {
    res.push(obj.hasOwnProperty(field));
  });
  if (res.includes(false)) {
    return false;
  } else {
    return true;
  }
};
export const addUser: postResponse = async (request, response) => {
  try {
    const list = await getRegionsList();
    const example = await getEntityFields('User');
    const hasRequiredFields = checkRequiredFileds(request.body);
    if (hasRequiredFields === true) {
      if (request.body.role === UserRole.creator &&
        (request.body.hasOwnProperty('region') === true &&
          list.includes(request.body.region) === true)
      ) {
        const region = await getRepository(Region).findOne({ where: { name: request.body.region } });
        const user = await createUser(request.body);
        if (region instanceof Region) {
          user.regions = [region];
        }
        const res = await getRepository(User).save(user); // .save(user);
        responderSuccessCreated(response, 'User was created', [res]);

      } else if ((request.body.hasOwnProperty('role') === true && request.body.role === UserRole.reporter)) {
        const user = await createUser(request.body);
        const res = await getRepository(User).save(user); // .save(user);
        responderSuccessCreated(response, 'User was created', [res]);
      } else {
        responderMissingBodyValue(response, example);
      }
    } else {
      responderMissingBodyValue(response, example);

    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
