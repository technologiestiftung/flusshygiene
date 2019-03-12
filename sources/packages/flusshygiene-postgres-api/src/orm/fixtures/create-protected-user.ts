import { User } from '../entity/User';
import { UserRole } from '../../lib/types-interfaces';

export const createProtectedUser = (): User => {
let protectedUser = new User();
protectedUser.firstName = 'Conan';
protectedUser.lastName = 'the Barbarian';
protectedUser.role = UserRole.admin;
protectedUser.email = 'moron-zirfas@technologiestiftung-berlin.de'; // for now
protectedUser.protected = true;
return protectedUser;
};
