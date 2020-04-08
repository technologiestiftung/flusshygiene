export const REACT_APP_AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
export const REACT_APP_AUTH0_CLIENTID = process.env.REACT_APP_AUTH0_CLIENTID;
export const REACT_APP_AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
export const REACT_APP_MAPBOX_API_TOKEN =
  process.env.REACT_APP_MAPBOX_API_TOKEN;
export const REACT_APP_DOMAIN_URL = process.env.REACT_APP_DOMAIN_URL;
export const REACT_APP_DOMAIN_NICE_NAME =
  process.env.REACT_APP_DOMAIN_NICE_NAME;
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line
  console.info(
    `Connecting to REACT_APP_API_HOST "${process.env.REACT_APP_API_HOST}"`,
  );
  if (
    process.env.REACT_APP_API_HOST !== undefined &&
    process.env.REACT_APP_API_HOST.length === 0
  ) {
    // eslint-disable-next-line
    console.warn(
      'The env variable REACT_APP_API_HOST is defined but has no String.length. You should be running in a container in "production" or the postgres-api should be running on your machine proxied by CRA. If not  this is an error. Check your .env file for the REACT_APP_API_HOST value',
    );
  }
}
export const REACT_APP_API_HOST = process.env.REACT_APP_API_HOST;
