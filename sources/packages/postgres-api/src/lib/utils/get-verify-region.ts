import { Region } from '../../orm/entity';
import { findByName } from './region-repo-helpers';

export const getAndVerifyRegion = async (obj: any) => {
  try {
    let region: Region | undefined;
    if (obj.hasOwnProperty('region') === true) {
      region = await findByName(obj.region);
      if (region instanceof Region) {
        return region;
      }
    }
    return region;
  } catch (error) {
    throw error;
  }
};
