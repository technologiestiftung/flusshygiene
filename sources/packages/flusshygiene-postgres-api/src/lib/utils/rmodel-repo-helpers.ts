import { getRepository } from 'typeorm';
import { BathingspotModel } from './../../orm/entity/BathingspotModel';
export const getRModelWithRelation: (
  modelId: number,
  relation: string,
) => Promise<BathingspotModel> = async (modelId, relation) => {
  try {
    const spotRepo = getRepository(BathingspotModel);

    const query = spotRepo
      .createQueryBuilder('bathingspot_model')
      .leftJoinAndSelect(`bathingspot_model.r_model_file`, relation)
      .where('bathingspot_model.id = :modelId', { modelId });
    const modelWithRelation = await query.getOne();
    return modelWithRelation;
  } catch (error) {
    return error;
  }
};
