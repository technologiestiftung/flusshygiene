import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { getTokenOnce } from "./auth/token";
import { getSpots, getRemoteData, getUsers } from "./requests/get-data";
import { getSubitems } from "./requests/get-sub-items";
import { API_URL } from "./common/env";
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

export async function main() {
  try {
    await getTokenOnce(path.resolve(process.cwd(), ".token"));
    const users = await getUsers(`${API_URL}/users`);

    const collection = await getSpots(users);
    const reqSources = await getSubitems(collection, "genericInputs");
    // console.log("Request source", JSON.stringify(reqSources, null, 2)); // eslint-disable-line
    const remoteData = await getRemoteData(reqSources);
    console.log(remoteData); // eslint-disable-line
  } catch (error) {
    throw error;
  }
}
