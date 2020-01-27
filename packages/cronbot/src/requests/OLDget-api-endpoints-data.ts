// import got from "got";
// import {
//   IMeasurement,
//   IEndpoints,
//   IMeasurementConc,
//   Spot,
// } from "../common/interfaces";
// import { DB } from "../lib/DB";
// import shortid from "shortid";

// const db = DB.getInstance();

// export const getApiEndpointsData: (spots: Spot[]) => Promise<void> = async (
//   spots,
// ) => {
//   try {
//     for (const spot of spots) {
//       // TODO: Error handling
//       const data: IEndpoints = {
//         id: shortid.generate(),
//         user: { id: spot.userId as number, email: spot.email as string },
//         spot: { id: spot.spotId as number, name: spot.spotName as string },
//         discharges: [],
//         measurements: [],
//         globalIrradiances: [],
//       };
//       if (spot.apiEndpoints.hasOwnProperty("measurementsUrl")) {
//         data.measurementsUrl = spot.apiEndpoints.measurementsUrl;
//         let m: IMeasurementConc[] = [];
//         const measurements = await got(spot.apiEndpoints.measurementsUrl!); // TODO: Could throw
//         // console.log(JSON.parse(measurements.body));
//         m = JSON.parse(measurements.body).data; // TODO: Could throw
//         data.measurements = m;
//       }
//       if (spot.apiEndpoints.hasOwnProperty("globalIrradianceUrl")) {
//         data.globalIrradianceUrl = spot.apiEndpoints.globalIrradianceUrl;
//         let g: IMeasurement[] = [];
//         const measurements = await got(spot.apiEndpoints.globalIrradianceUrl!); // TODO: Could throw
//         // console.log(JSON.parse(measurements.body));
//         g = JSON.parse(measurements.body).data; // TODO: Could throw
//         data.globalIrradiances = g;
//       }
//       if (spot.apiEndpoints.hasOwnProperty("dischargesUrl")) {
//         data.dischargesUrl = spot.apiEndpoints.dischargesUrl;
//         let d: IMeasurement[] = [];
//         const measurements = await got(spot.apiEndpoints.dischargesUrl!); // TODO: Could throw
//         // console.log(JSON.parse(measurements.body));
//         d = JSON.parse(measurements.body).data; // TODO: Could throw
//         data.discharges = d;
//       }
//       db.addEndpoints(data);
//     }
//   } catch (error) {
//     console.error(error);

//     throw error;
//   }
// };
