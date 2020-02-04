import { gotOptionsFactory } from "./../../utils/got-util";
import { DB } from "../DB";
import { API_URL } from "../../common/env";
import got from "got/dist/source";
const db = DB.getInstance();
export const getSpotModelInfo: () => Promise<void> = async () => {
  const spots = db.getSpots();
  // const updatedSpots: Spot[] = [];
  // console.log(spots);
  for (const spot of spots) {
    try {
      const url = `${API_URL}/users/${spot.userId}/bathingspots/${spot.spotId}/models`;
      const opts = await gotOptionsFactory({ url });
      const response = await got(opts);
      try {
        const json = JSON.parse(response.body);
        // console.log(json);
        if (json.success === true) {
          if (json.data.length > 0) {
            db.updateSpot(spot.spotId, true);
            // console.log("updateSpot");
            // for (const item of json.data) {
            //   if (item.rmodelfiles.length > 0) {
            //     break;
            //   }
            // }
          }
        }
      } catch (parseError) {
        console.error(parseError);
        throw parseError;
      }
    } catch (reqError) {
      console.error(reqError);
      throw reqError;
    }
  }
};
