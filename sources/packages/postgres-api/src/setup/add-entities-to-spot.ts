import { Connection, getRepository } from 'typeorm';
import {
  Bathingspot,
  BathingspotMeasurement,
  BathingspotPrediction,
} from '../orm/entity';

// const isPrediction = (entity: BathingspotMeasurement|BathingspotPrediction): entity is BathingspotPrediction {
//   return (<BathingspotPrediction>entity).prediction !== undefined;
// }

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

export interface IAddEntitiesToSpotOptions {
  entities: BathingspotMeasurement[] | BathingspotPrediction[];
  connection: Connection;
}
export type AddEntitiesToSpot = (
  options: IAddEntitiesToSpotOptions,
) => Promise<void>;

// used in app.ts for setup
export const addEntitiesToSpot: AddEntitiesToSpot = async (options) => {
  try {
    const spotRepo = getRepository(Bathingspot);
    for (const entity of options.entities) {
      const fOpts = { where: {} };

      switch (true) {
        case entity instanceof BathingspotMeasurement:
          fOpts.where = {
            detailId: (entity as BathingspotMeasurement).detailId,
          };
          break;
        case entity instanceof BathingspotPrediction:
          fOpts.where = {
            oldId: (entity as BathingspotPrediction).oldId,
          };
          break;
      }

      const bspot = await spotRepo.findOne(fOpts);

      if (bspot !== undefined) {
        if (entity instanceof BathingspotPrediction) {
          // console.log('got prediction');
          if (bspot.predictions === undefined) {
            bspot.predictions = [entity];
          } else {
            bspot.predictions.push(entity);
          }
        } else if (entity instanceof BathingspotMeasurement) {
          if (bspot.measurements === undefined) {
            bspot.measurements = [entity];
          } else {
            bspot.measurements.push(entity);
          }
        }
        await options.connection.manager.save(entity);
        await options.connection.manager.save(bspot);
      }
    }
  } catch (error) {
    throw error;
  }
};
