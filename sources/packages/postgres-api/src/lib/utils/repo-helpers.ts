import { getRepository, Repository } from 'typeorm';
import {
  BathingspotPrediction,
  BathingspotMeasurement,
  PurificationPlant,
  BathingspotModel,
  GenericInput,
  GlobalIrradiance,
  Discharge,
  Rain,
  ImageFile,
} from '../../orm/entity';

export const getRepoByName: (name: string) => Repository<any> = (name) => {
  switch (name) {
    case 'predictions': {
      const repo = getRepository(BathingspotPrediction);
      return repo;
    }

    case 'measurements': {
      const repo = getRepository(BathingspotMeasurement);
      return repo;
    }
    case 'purificationPlants': {
      const repo = getRepository(PurificationPlant);
      return repo;
    }
    case 'models': {
      const repo = getRepository(BathingspotModel);
      return repo;
    }
    case 'genericInputs': {
      const repo = getRepository(GenericInput);
      return repo;
    }
    case 'globalIrradiances': {
      const repo = getRepository(GlobalIrradiance);
      return repo;
    }
    case 'discharges': {
      const repo = getRepository(Discharge);
      return repo;
    }
    case 'rains': {
      const repo = getRepository(Rain);
      return repo;
    }
    case 'images': {
      const repo = getRepository(ImageFile);
      return repo;
    }
    default:
      throw new Error('Unknown name for repo');
      break;
  }
};
