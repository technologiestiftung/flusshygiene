
import {
  getBathingspotById,
  getRegionsList,
  getSpotByUserAndId,
  getUserWithRelations,
} from '../src/lib/repositories/custom-repo-helpers';

describe('testing errors on repo helpers', () => {
  it('should be catch error due to missing db', (done) => {
    getUserWithRelations(1, []).catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });

  it('should be catch error due to missing db', (done) => {
    getBathingspotById(1).catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });

  it('should be catch error due to missing db', (done) => {
    getSpotByUserAndId(1, 1).catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });
  it('should be catch error due to missing db', (done) => {
    getRegionsList().catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });
});

