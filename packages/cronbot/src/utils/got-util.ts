import { API_URL, getApiToken } from "../common/env";
import { buildHeaders } from "../common/headers";

export interface IGotOptionsOverrides {
  url?: string;
  headers?: {
    authorization?: string;
  };
  json?: any;
}
export const gotOptionsFactory: (
  overrides?: IGotOptionsOverrides,
) => Promise<IGotOptionsOverrides> = async (overrides) => {
  try {
    const token = getApiToken();
    // console.log(token);
    if (
      token === undefined &&
      overrides?.headers?.authorization === undefined
    ) {
      throw new Error("gotOptionsFactory could not find a token");
    }

    const headers = buildHeaders({ authorization: token ? token : "" });
    const opts: IGotOptionsOverrides = {
      url: `${API_URL}`,
      headers,
      ...overrides,
    };
    return opts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
