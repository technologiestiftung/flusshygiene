import { version } from '../version';
const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
const OCPU_API_HOST = process.env[`OCPU_API_HOST_${ENV_SUFFIX}`];
const SESSION_SECRET = process.env[`SESSION_SECRET_${ENV_SUFFIX}`];
const VERSION = version();

// const CONSTANTS = [ENV_SUFFIX, OCPU_API_HOST, SESSION_SECRET, VERSION];
// if (CONSTANTS.includes(undefined)) {
//   throw new Error('env variable not set');
// }

// ---------------------------------------
export { VERSION, ENV_SUFFIX, OCPU_API_HOST, SESSION_SECRET };
