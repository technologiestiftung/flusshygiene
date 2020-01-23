import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
import { getTokenOnce } from "./auth/token";
import { getSpots, Spot } from "./requests/get-spots";
import { getUsers } from "./requests/get-users";
import { API_URL } from "./common/env";
import { getApiEndpointsData } from "./get-api-endpoints-data";
import { getGenericData } from "./get-generic-pplant-data";

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
    const spots: Spot[] = await getSpots(users);
    await getApiEndpointsData(spots);
    await getGenericData("genericInputs", spots);
    await getGenericData("purificationPlants", spots);
  } catch (error) {
    throw error;
  }
}
