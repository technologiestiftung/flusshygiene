import { API_URL, getApiToken } from "./../common/env";

export interface IGotOptionsOverrides {
  url?: string;
  headers?: {
    authorization?: string;
  };
}
export const gotOptionsFactory: (
  overrides?: IGotOptionsOverrides,
) => Promise<IGotOptionsOverrides> = async (overrides) => {
  try {
    const token = getApiToken();
    console.log(token);
    if (
      token === undefined &&
      overrides?.headers?.authorization === undefined
    ) {
      throw new Error("gotOptionsFactory could not find a token");
    }

    const opts: IGotOptionsOverrides = {
      url: `${API_URL}`,
      headers: { authorization: token },
      ...overrides,
    };
    return opts;
  } catch (error) {
    return error;
  }
};