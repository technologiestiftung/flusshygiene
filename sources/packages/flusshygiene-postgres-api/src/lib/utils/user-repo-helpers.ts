// user-repo-helpers.ts
import { User } from '../../orm/entity/User';
import { getRepository } from 'typeorm';

export const getUserByAuth0id: (auth0id: string) => Promise<User | undefined> = async (auth0Id) => {
  try {
    const userRepo = getRepository(User);
    const query = userRepo.createQueryBuilder('user').where('user.auth0Id = :auth0Id', { auth0Id });
    const user = await query.getOne();
    return user;
  } catch (error) {
    return error;
  }
}
