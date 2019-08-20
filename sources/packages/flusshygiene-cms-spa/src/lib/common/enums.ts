export const WaterqualityStateText = {
  1: 'Zum Baden geeignet',
  2: 'Zum Baden geeignet',
  11: 'Zum Baden geeignet',
  12: 'Zum Baden geeignet',
  3: 'Vom Baden wird abgeraten',
  4: 'Vom Baden wird abgeraten',
  13: 'Vom Baden wird abgeraten',
  14: 'Vom Baden wird abgeraten',
  10: 'Vom Baden wird abgeraten',
  9: 'Keine Angabe',
  5: 'Badeverbot',
  6: 'Badeverbot',
  15: 'Badeverbot',
  16: 'Badeverbot',
};

/**
 * All the routes in the applicaiotn
 * @property {string} bathingspot  'badestellen',
 * @property {string} index  '',
 * @property {string} info  'info',
 * @property {string} questionnaire  'standortbewertung',
 */
export enum RouteNames {
  bathingspot = 'badestellen',
  editor = 'bearbeiten',
  index = '',
  info = 'info',
  questionnaire = 'standortbewertung',
  report = 'standortbewertung/auswertung',
  login = 'login',
  logout = 'logout',
  user = 'user',
  passwordreset = 'user/password-reset',
  callback = 'callback',
}

export enum RouteParams {
  bathingspotId = ':spotId([0-9]+)',
  questionId = ':qId([0-9]+)',
}

export enum TrafficLightColorNames {
  red = 'rot',
  green = 'grün',
  orange = 'orange',
}

/**
 * @property button = 'button',
 * @property submit = 'submit',
 * @property reset = 'reset',
 */
export enum ButtonPropsType {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}

export enum EnvSuffixes {
  dev = 'DEV',
  prod = 'PROD',
}
export enum ApiResources {
  bathingspots = 'bathingspots',
  users = 'users',
}
export enum APIMountPoints {
  v1 = 'api/v1',
}
