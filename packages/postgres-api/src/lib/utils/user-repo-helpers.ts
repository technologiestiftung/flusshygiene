// user-repo-helpers.ts
import { getRepository } from 'typeorm';
import { User } from '../../orm/entity/User';

export const getUserByAuth0id: (
  auth0id: string,
) => Promise<User | undefined> = async (auth0Id) => {
  try {
    const userRepo = getRepository(User);
    const query = userRepo
      .createQueryBuilder('user')
      .where('user.auth0Id = :auth0Id', { auth0Id });
    const user = await query.getOne();
    return user;
  } catch (error) {
    return error;
  }
};
export const getUserById: (userId: string) => Promise<User> = async (
  userId,
) => {
  try {
    const userRepo = getRepository(User);
    const query = userRepo
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId });
    const user = await query.getOne();
    return user;
  } catch (error) {
    return error;
  }
};

export const getUserByIdWithSpots: (userId: number) => Promise<User> = async (
  userId,
) => {
  try {
    const userRepo = getRepository(User);
    const query = userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bathingspots', 'bathingspot')
      .where('user.id = :userId', { userId });
    const user = await query.getOne();
    return user;
  } catch (error) {
    return error;
  }
};

export const getUsersByRole: (role: string) => Promise<User[]> = async (
  role,
) => {
  try {
    const repo = getRepository(User);
    const query = repo
      .createQueryBuilder('user')
      .where('user.role = :role', { role });
    const users = await query.getMany();
    return users;
  } catch (error) {
    return error;
  }
};
// export const getUserWithBathingspots: (userId: number) => Promise<User> = async (userId) =>{
//   try {

//     const repo = getRepository(Bathingspots);

//     const query = repo.createQueryBuilder('bathingspots')
//     .leftJoinAndSelect('user', 'user')
//   } catch (error) {
//     return error;
//   }
// }
