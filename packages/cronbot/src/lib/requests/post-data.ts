import { IGeneric, IEndpoints } from "../../common/interfaces";
import { GenericType } from "../../common/types";
import { gotOptionsFactory } from "../../utils/got-util";
import { API_URL } from "../../common/env";
import got from "got";
export const postGenerics: (
  type: GenericType,
  data: IGeneric[],
) => Promise<void> = async (type, data) => {
  try {
    // console.log("postdata");
    for (const item of data) {
      const opts = await gotOptionsFactory({
        url: `${API_URL}/users/${item.user.id}/bathingspots/${item.spot.id}/${type}/${item.pgId}/measurements`,
        json: item.data,
      });
      // console.log(opts);
      await got.post(opts as any); // TODO: Could throw
      // console.log(JSON.parse(res.body));
    }
  } catch (error) {
    console.error(error);
    // report
    throw error;
  }
};

export const postApiEndpoints: (
  data: IEndpoints[],
) => Promise<boolean> = async (data) => {
  try {
    for (const item of data) {
      const BASE_URL = `${API_URL}/users/${item.user.id}/bathingspots/${item.spot.id}`;
      if (item.discharges.length > 0) {
        const opts = await gotOptionsFactory({
          url: `${BASE_URL}/discharges`,
          json: item.discharges,
        });
        await got.post(opts); // TODO: Could throw
      }

      if (item.measurements.length > 0) {
        const opts = await gotOptionsFactory({
          url: `${BASE_URL}/measurements`,
          json: item.measurements,
        });
        await got.post(opts); // TODO: Could throw
      }
      if (item.globalIrradiances.length > 0) {
        const opts = await gotOptionsFactory({
          url: `${BASE_URL}/globalIrradiances`,
          json: item.globalIrradiances,
        });
        await got.post(opts); // TODO: Could throw
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
