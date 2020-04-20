import { logger } from "./utils/logger";
import shortid from "shortid";
import { globals } from "./common/globals";
// import { sendReports } from "./lib/report";
import { postApiEndpoints, postGenerics } from "./lib/requests/post-data";
// import { GenericType } from "./common/types";
// import got from "got";
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { getTokenOnce } from "./auth/token";
import { getSpots } from "./lib/requests/get-spots";
import { getUsers } from "./lib/requests/get-users";
import { API_URL, FLSSHYGN_PREDICT_URL } from "./common/env";
import { getApiEndpointsData } from "./lib/requests/get-api-endpoints-data";
// import { getGenericData } from "./lib/requests/get-generic-pplant-data";
import { DB } from "./lib/DB";
import { getGenericData } from "./lib/requests/get-generic-pplant-data";
// import { GenericType } from "./common/types";
import { sendReports } from "./lib/report";
import got, { HTTPError } from "got/dist/source";
import { getSpotModelInfo } from "./lib/requests/get-spot-model-info";
import { IReport } from "./common/interfaces";
import { buildHeaders } from "./common/headers";
// import { DB } from "./DB";

/**
 * Should
 * - get a token
 *
 * - get all users?
 *
 * - get all users? spots
 *    - get all endpoints
 *    - get all data
 *    - POST
 *
 * - get all PPlants
 *    - get all their endpoints
 *    - get all data
 *    - POST
 *
 *  - get all Gis
 *    - get all their endpoints
 *    - get all data
 *    - POST
 *
 * - validate?
 * - send error messages?
 * - send success messages?
 * - should be callalbe as cli and from process
 * - should run on AWS Fargate
 *
 * - cli accepts input as JSON? with:
 * {
 *  spots:[{id: number, apiEndpoints: {see pgapi}}]
 *  pplants:[{id: number, url: string}]
 *  gis: [{id: number, url: string}]
 * }
 *
 */

// const db = DB.getInstance();

export async function main() {
  try {
    // console.log("ADMIN", globals.ADMIN_ONLY);
    // console.log("VERBOSE", globals.VERBOSE);
    // console.log("SKIP", globals.SKIP_MAIL);
    const db = DB.getInstance();
    await getTokenOnce(path.resolve(process.cwd(), ".token"));

    // process.exit();
    const users = await getUsers(`${API_URL}/users`);
    await getSpots(users);
    // console.log(db.getSpots());
    await getSpotModelInfo();

    // console.log(spots);
    await getApiEndpointsData();
    await getGenericData("genericInputs");
    await getGenericData("purificationPlants");

    const dataGi = db.getGenerics("genericInputs");
    const dataPP = db.getGenerics("purificationPlants");
    const dataE = db.getEndpoints();
    // console.log(dataE, "data E");
    await postGenerics("genericInputs", dataGi);
    await postGenerics("purificationPlants", dataPP);
    await postApiEndpoints(dataE);
    // const reports = db.getReports();

    if (globals.PREDICT === true) {
      const spots = db.getSpots();
      // call predict
      for (const spot of spots) {
        try {
          if (spot.hasModel === true) {
            logger.info(`Starting prediction for spot ${spot.spotId}`);
            const url = FLSSHYGN_PREDICT_URL;
            try {
              const headers = buildHeaders();
              await got.post({
                url,
                headers,
                json: {
                  spot_id: spot.spotId,
                  user_id: spot.userId,
                },
              });
            } catch (error) {
              if (error instanceof HTTPError) {
                const report: IReport = {
                  id: shortid(),
                  message: error.response.body as string,
                  email: "admin",
                  source: spot,
                  type: "admin",
                  specifics: `spot: ${spot.spotId} user: ${spot.userId} mail: ${spot.email} type: predict`,
                };
                db.addReports(report);
              }
            }
            // console.log(response.body);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    if (globals.SKIP_MAIL === false) {
      await sendReports();
    }
    // console.log(pplantData);

    // for (const plant of pplantData) {
    //   const opts = await gotOptionsFactory({
    //     url: `${API_URL}/users/${plant.user.id}/bathingspots/${plant.spot.id}/${type}/${plant.pgId}/measurements`,
    //     json: plant.data,
    //   });
    //   console.log(opts);
    //   const res = await got.post(opts as any);
    //   console.log(JSON.parse(res.body));
    // }
  } catch (error) {
    console.error(error);

    throw error;
  }
}
