import { getRepository } from 'typeorm';
import {
  BathingspotMeasurement,
  BathingspotModel,
  BathingspotPrediction,
  Discharge,
  GenericInput,
  GlobalIrradiance,
  PurificationPlant,
  Rain,
} from '../../orm/entity';
import { IObject } from '../common';

export const collectionRepoMapping: IObject = {
  discharges: 'Discharge',
  genericInputs: 'GenericInput',
  globalIrradiances: 'GlobalIrradiance',
  measurements: 'BathingspotMeasurement',
  models: 'BathingspotModel',
  predictions: 'BathingspotPrediction',
  purificationPlants: 'PurificationPlant',
  rains: 'Rain',
};

export const getGIWithRelations: (
  itemId: string,
) => Promise<GenericInput | undefined> = async (itemId) => {
  try {
    const repo = getRepository(GenericInput);
    const query = repo
      .createQueryBuilder('generic_input')
      .leftJoinAndSelect('generic_input.measurements', 'measurements')
      .where('generic_input.id = :itemId', { itemId });
    const giWithRelation = await query.getOne();
    return giWithRelation;
  } catch (error) {
    throw error;
  }
};

export const getPPlantWithRelations: (
  itemId: string,
) => Promise<PurificationPlant | undefined> = async (itemId) => {
  try {
    const repo = getRepository(PurificationPlant);
    const query = repo
      .createQueryBuilder('purufication_plant')
      .leftJoinAndSelect('purufication_plant.measurements', 'measurements')
      .where('purufication_plant.id = :itemId', { itemId });
    const ppWithRelation = await query.getOne();
    return ppWithRelation;
  } catch (error) {
    throw error;
  }
};
export const getColletionItemById: (
  itemId: string,
  repoName: string,
) => Promise<
  | BathingspotPrediction
  | BathingspotMeasurement
  | BathingspotModel
  | PurificationPlant
  | GenericInput
  | Rain
  | GlobalIrradiance
  | Discharge
  | undefined
> = async (itemId: string, repoName: string) => {
  try {
    const repo = getRepository(repoName);
    // console.log(repo);

    const query = repo
      .createQueryBuilder(repoName)
      .where(`${repoName}.id = :itemId`, { itemId });

    const entity = await query.getOne();
    switch (repoName) {
      case 'BathingspotPrediction':
        return entity as BathingspotPrediction;
      case 'BathingspotMeasurement':
        return entity as BathingspotMeasurement;
      case 'BathingspotModel':
        return entity as BathingspotModel;

      case 'PurificationPlant':
        return entity as PurificationPlant;
      case 'GenericInput':
        return entity as GenericInput;
      case 'Rain':
        return entity as Rain;
      case 'GlobalIrradiance':
        return entity as GlobalIrradiance;
      case 'Discharge':
        return entity as Discharge;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};
