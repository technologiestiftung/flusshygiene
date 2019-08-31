if (process.env.REACT_APP_MAPBOX_API_TOKEN === undefined) {
  throw new Error('No env variable avaialabe');
  // process.exit(1);
}
