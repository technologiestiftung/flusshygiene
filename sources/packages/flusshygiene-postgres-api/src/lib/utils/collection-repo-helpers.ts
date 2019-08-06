import { getRepository } from 'typeorm';

export const getColletionItemById = async (
  itemId: string,
  repoName: string,
) => {
  try {
    const repo = getRepository(repoName);
    const query = repo
      .createQueryBuilder(repoName)
      .where(`${repoName}.id = :itemId`, { itemId });
    const entity = await query.getOne();
    return entity;
  } catch (error) {
    throw error;
  }
};
