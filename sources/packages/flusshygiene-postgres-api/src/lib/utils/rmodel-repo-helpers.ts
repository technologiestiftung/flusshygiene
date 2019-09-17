import { getRepository } from 'typeorm';
import { BathingspotModel } from './../../orm/entity/BathingspotModel';
export const getRModelWithRelation: (
  modelId: number,
) => Promise<BathingspotModel | undefined> = async (modelId) => {
  try {
    const spotRepo = getRepository(BathingspotModel);

    const query = spotRepo
      .createQueryBuilder('bathingspot_model')
      .leftJoinAndSelect(`bathingspot_model.rmodelfiles`, 'rmodelfile')
      .where('bathingspot_model.id = :modelId', { modelId });
    const modelWithRelation = await query.getOne();
    // console.log('model with relation', modelWithRelation);
    return modelWithRelation;
  } catch (error) {
    throw error;
  }
};
