import { getRepository } from 'typeorm';
import { IObject } from '../common';
import { BathingspotMeasurement } from './../../orm/entity/BathingspotMeasurement';

export const createMeasurementWithValues: (obj: IObject) => Promise<BathingspotMeasurement> = async (obj) => {
  try {
    const mesRepo = getRepository(BathingspotMeasurement);
    const measurement = new BathingspotMeasurement();
    // console.log(obj);
    mesRepo.merge(measurement, obj);
    return measurement;
  } catch (error) {
    throw error;
  }
};
