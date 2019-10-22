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
  auth0Id: string;
}
const userData: IUserData[] = [
  {
    email: 'moron-zirfas@technologiestiftung-berlin.de',
    firstName: 'Shera',
    lastName: 'the Princess of Power',
    protected: false,
    role: UserRole.reporter,
    auth0Id: '',
  },
  {
    email: 'moron-zirfas@technologiestiftung-berlin.de',
    firstName: 'Conan',
    lastName: 'the Barbarian',
    protected: true,
    role: UserRole.admin,
    auth0Id: '',
  },
  {
    email: 'u1@flsshygn.arend.uberspace.de',
    firstName: 'User',
    lastName: 'One',
    protected: true,
    role: UserRole.creator,
    auth0Id: process.env.U1_AUTH0ID || '',
  },
  {
    email: 'u2@flsshygn.arend.uberspace.de',
    firstName: 'User',
    lastName: 'Two',
    protected: true,
    role: UserRole.creator,
    auth0Id: process.env.U2_AUTH0ID || '',
  },
  {
    email: 'u3@flsshygn.arend.uberspace.de',
    firstName: 'User',
    lastName: 'Three',
    protected: true,
    role: UserRole.creator,
    auth0Id: process.env.U3_AUTH0ID || '',
  },
  {
    email: 'u4@flsshygn.arend.uberspace.de',
    firstName: 'User',
    lastName: 'Four',
    protected: true,
    role: UserRole.creator,
    auth0Id: process.env.U4_AUTH0ID || '',
  },
  {
    email: 'u5@flsshygn.arend.uberspace.de',
    firstName: 'User',
    lastName: 'Five',
    protected: true,
    role: UserRole.creator,
    auth0Id: process.env.U5_AUTH0ID || '',
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
  userData.forEach((ele) => {
    const user = new User();
    user.firstName = ele.firstName;
    user.lastName = ele.lastName;
    user.role = ele.role;
    user.email = ele.email;
    user.protected = ele.protected;
    user.auth0Id = ele.auth0Id;
    users.push(user);
  });
  return users;
};
