import { getRepository } from 'typeorm';
import { IObject } from '../common';
import { BathingspotPrediction } from './../../orm/entity/BathingspotPrediction';

export const createPredictionWithValues: (obj: IObject) => Promise<BathingspotPrediction> = async (obj) => {
  try {
    const mesRepo = getRepository(BathingspotPrediction);
    const measurement = new BathingspotPrediction();
    // console.log(obj);
    mesRepo.merge(measurement, obj);
    return measurement;
  } catch (error) {
    throw error;
  }
};
