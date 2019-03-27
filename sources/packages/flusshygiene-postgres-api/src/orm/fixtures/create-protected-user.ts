import { UserRole } from '../../lib/types-interfaces';
import { User } from '../entity/User';

export const createProtectedUser = (): User => {
const protectedUser = new User();
protectedUser.firstName = 'Conan';
protectedUser.lastName = 'the Barbarian';
protectedUser.role = UserRole.admin;
protectedUser.email = 'moron-zirfas@technologiestiftung-berlin.de'; // for now
protectedUser.protected = true;
return protectedUser;
};
