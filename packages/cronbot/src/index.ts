import { sendReports } from "./lib/report";
import { postGenerics, postApiEndpoints } from "./lib/requests/post-data";
// import { GenericType } from "./common/types";
// import got from "got";
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { getTokenOnce } from "./auth/token";
import { getSpots } from "./lib/requests/get-spots";
import { getUsers } from "./lib/requests/get-users";
import { API_URL } from "./common/env";
import { getApiEndpointsData } from "./lib/requests/get-api-endpoints-data";
import { getGenericData } from "./lib/requests/get-generic-pplant-data";
import { Spot } from "./common/interfaces";
import { DB } from "./lib/DB";
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
    await getTokenOnce(path.resolve(process.cwd(), ".token"));

    // process.exit();
    const users = await getUsers(`${API_URL}/users`);
    const spots: Spot[] = await getSpots(users);
    // console.log(spots, API_URL);
    await getApiEndpointsData(spots);
    await getGenericData("genericInputs", spots);
    await getGenericData("purificationPlants", spots);
    // const type: GenericType = "purificationPlants";
    // const pplantData = db.getGenerics(type);
    const db = DB.getInstance();
    const dataGi = db.getGenerics("genericInputs");
    const dataPP = db.getGenerics("purificationPlants");
    const dataE = db.getEndpoints();
    await postGenerics("genericInputs", dataGi);
    await postGenerics("purificationPlants", dataPP);
    await postApiEndpoints(dataE);
    const reports = db.getReports();
    await sendReports(reports);
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
