import { ModelParamter } from '../../src/lib/common/index';
import { Bathingspot } from '../../src/orm/entity/Bathingspot';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import { Connection, getRepository } from 'typeorm';
import { DefaultRegions } from '../../src/lib/common';
import routes from '../../src/lib/routes';
import { getRegionsList } from '../../src/lib/utils/region-repo-helpers';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
} from '../test-utils';
import { getUserByIdWithSpots } from '../../src/lib/utils/user-repo-helpers';
import { getRModelWithRelation } from '../../src/lib/utils/rmodel-repo-helpers';
import { BathingspotModel } from '../../src/orm/entity';
// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

describe('misc functions that need a DB', () => {
  let app: Application;
  let connections: Connection[];

  beforeAll(async (done) => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error(
        'We are not in the test env this is harmful tables will be dropped',
      );
    }
    connections = await createTestingConnections();
    done();
  });
  // beforeEach(async (done) => {
  //   try {
  //     await reloadTestingDatabases(connections);
  //     done();
  //   } catch (err) {
  //     console.warn(err.message);
  //   }
  // });
  afterAll(async (done) => {
    try {
      await reloadTestingDatabases(connections);
      await closeTestingConnections(connections);
      done();
    } catch (err) {
      console.warn(err.message);
      throw err;
    }
  });

  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);

  // ███████╗███████╗████████╗██╗   ██╗██████╗
  // ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
  // ███████╗█████╗     ██║   ██║   ██║██████╔╝
  // ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
  // ███████║███████╗   ██║   ╚██████╔╝██║
  // ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

  // ██████╗  ██████╗ ███╗   ██╗███████╗
  // ██╔══██╗██╔═══██╗████╗  ██║██╔════╝
  // ██║  ██║██║   ██║██╔██╗ ██║█████╗
  // ██║  ██║██║   ██║██║╚██╗██║██╔══╝
  // ██████╔╝╚██████╔╝██║ ╚████║███████╗
  // ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝
  describe('misc functions that need a DB', () => {
    test('should return a list of default regions', async (done) => {
      const list = await getRegionsList();
      for (const key in DefaultRegions) {
        if (DefaultRegions.hasOwnProperty(key)) {
          const element = DefaultRegions[key];
          expect(list.includes(element)).toBe(true);
        }
      }
      done();
    });
  });

  describe('testing rmodel repo helpers', () => {
    test('should return model or undefiend', async (done) => {
      const srepo = getRepository(Bathingspot);
      const spot = srepo.create();
      spot.name = 'foo';
      spot.isPublic = false;
      const mrepo = getRepository(BathingspotModel);
      const model = getRepository(BathingspotModel).create({
        parameter: ModelParamter.conc_ie,
      });
      spot.models = [model];
      const mres = await mrepo.save(model);

      await srepo.save(spot);
      const res = await getRModelWithRelation(mres.id);
      expect(res).toBeDefined();
      done();
    });
    test('should throw an error', async (done) => {
      const mockConsoleErr = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      expect(getRModelWithRelation(NaN)).rejects.toThrow();
      // const res = await getRModelWithRelation(NaN);
      mockConsoleErr.mockRestore();
      done();
    });
  });

  describe('testing errors on repo helpers', () => {
    it('should be catch error due to missing db', (done) => {
      getUserByIdWithSpots(10000)
        .then((res) => {
          expect(res).toBe(undefined);
          done();
        })
        .catch((err) => {
          expect(err.message).toEqual('Connection "default" was not found.');
          done();
        });
    });

    // it('should be catch error due to missing db', (done) => {
    //   getSpotByUserAndId(10000, 10000).then(res => {
    //     expect(res).toBe(undefined);
    //     done();
    //   }).catch(err => {
    //     expect(err.message).toEqual('Connection "default" was not found.');
    //     done();
    //   });
    // });
  });
});
