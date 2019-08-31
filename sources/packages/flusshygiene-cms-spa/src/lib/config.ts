export const REACT_APP_AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
export const REACT_APP_AUTH0_CLIENTID = process.env.REACT_APP_AUTH0_CLIENTID;
export const REACT_APP_AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
export const REACT_APP_MAPBOX_API_TOKEN =
  process.env.REACT_APP_MAPBOX_API_TOKEN;
if (process.env.NODE_ENV === 'development') {
  console.info(
    `Connecting to REACT_APP_API_HOST ${process.env.REACT_APP_API_HOST}`,
  );
  if (
    process.env.REACT_APP_API_HOST !== undefined &&
    process.env.REACT_APP_API_HOST.length === 0
  ) {
    console.info(
      'The HOST is defined but has no location definition. You should be running in the container setup or the postgres-api should be running on your machine. If not is this an error',
    );
  }
}
export const REACT_APP_API_HOST = process.env.REACT_APP_API_HOST;
