import { IMeasurement } from "../dist/common/interfaces";
import got from "got";
import { IEndpoints, IMeasurementConc } from "./common/interfaces";
import { DB } from "./DB";
import shortid from "shortid";

const db = DB.getInstance();

export const getApiEndpointsData: (spots: any) => Promise<void> = async (
  spots,
) => {
  try {
    for (const spot of spots) {
      // TODO: Error handling
      const data: IEndpoints = {
        id: shortid.generate(),
        user: { id: spot.userId as number, email: spot.email as string },
        spot: { id: spot.spotId as number, name: spot.spotName as string },
        discharges: [],
        measurments: [],
        globalIrradiances: [],
      };
      if (spot.apiEndpoints.hasOwnProperty("measurementsUrl")) {
        data.measurementsUrl = spot.apiEndpoints.measurementsUrl;
        let m: IMeasurementConc[] = [];
        const measurements = await got(spot.apiEndpoints.measurementsUrl);
        // console.log(JSON.parse(measurements.body));
        m = JSON.parse(measurements.body).data;
        data.measurments = m;
      }
      if (spot.apiEndpoints.hasOwnProperty("globalIrradianceUrl")) {
        data.globalIrradianceUrl = spot.apiEndpoints.globalIrradianceUrl;
        let g: IMeasurement[] = [];
        const measurements = await got(spot.apiEndpoints.globalIrradianceUrl);
        // console.log(JSON.parse(measurements.body));
        g = JSON.parse(measurements.body).data;
        data.globalIrradiances = g;
      }
      if (spot.apiEndpoints.hasOwnProperty("dischargesUrl")) {
        data.dischargesUrl = spot.apiEndpoints.dischargesUrl;
        let d: IMeasurement[] = [];
        const measurements = await got(spot.apiEndpoints.dischargesUrl);
        // console.log(JSON.parse(measurements.body));
        d = JSON.parse(measurements.body).data;
        data.discharges = d;
      }
      db.addEndpoints(data);
    }
  } catch (error) {
    return error;
  }
};
