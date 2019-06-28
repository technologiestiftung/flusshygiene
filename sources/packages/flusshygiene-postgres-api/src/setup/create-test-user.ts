import { UserRole } from '../lib/common';
import { User } from '../orm/entity/User';

// export const createProtectedUser = (): User => {
//   const protectedUser = new User();
//   protectedUser.firstName = 'Conan';
//   protectedUser.lastName = 'the Barbarian';
//   protectedUser.role = UserRole.admin;
//   protectedUser.email = 'moron-zirfas@technologiestiftung-berlin.de'; // for now
//   protectedUser.protected = true;
//   return protectedUser;
// };

// export const createReporterUser = (): User => {
//   const reporter = new User();
//   reporter.firstName = 'Shera';
//   reporter.lastName = 'the Princess of Power';
//   reporter.role = UserRole.reporter;
//   reporter.email = 'moron-zirfas@technologiestiftung-berlin.de'; // for now
//   reporter.protected = false;
//   return reporter;
// };

interface IUserData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  protected: boolean;
}
const userData: IUserData[] = [{
  email: 'moron-zirfas@technologiestiftung-berlin.de',
  firstName: 'Shera',
  lastName: 'the Princess of Power',
  protected: false,
  role: UserRole.reporter,
},
{
  email: 'moron-zirfas@technologiestiftung-berlin.de',
  firstName: 'Conan',
  lastName: 'the Barbarian',
  protected: true,
  role: UserRole.admin,
},
// , {
//   email: 'faker@fake.com',
//   firstName: 'James',
//   lastName: 'Bond',
//   protected: false,
//   role: UserRole.creator,
// },
];
export const createUser = (): User[] => {
  const users: User[] = [];
  userData.forEach(ele => {
    const user = new User();
    user.firstName = ele.firstName;
    user.lastName = ele.lastName;
    user.role = ele.role;
    user.email = ele.email;
    user.protected = ele.protected;
    users.push(user);
  });
  return users;
};
