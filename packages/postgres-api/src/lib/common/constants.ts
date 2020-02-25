// import { IConstants } from '.';

const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

let AWS_BUCKET: string;
if (process.env[`AWS_BUCKET_${ENV_SUFFIX}`] === undefined) {
  throw new Error(`"AWS_BUCKET_${ENV_SUFFIX}" is undefined`);
} else {
  AWS_BUCKET = process.env[`AWS_BUCKET_${ENV_SUFFIX}`]!;
}
const REDIS_PORT =
  process.env[`REDIS_PORT_${ENV_SUFFIX}`] !== undefined
    ? parseInt(process.env[`REDIS_PORT_${ENV_SUFFIX}`]!, 10)
    : 6379;
// if (process.env[`REDIS_PORT_${ENV_SUFFIX}`] === undefined) {
//   throw new Error('REDIS_PORT is not defined');
// }

const REDIS_HOST =
  process.env[`REDIS_HOST_${ENV_SUFFIX}`] !== undefined
    ? process.env[`REDIS_HOST_${ENV_SUFFIX}`]
    : '127.0.0.1';
// if (process.env[`REDIS_HOST_${ENV_SUFFIX}`] === undefined) {
// throw new Error('REDIS_HOST is not defined');
// }

// if (process.env[`SESSION_SECRET_${ENV_SUFFIX}`] === undefined) {
//   throw new Error('SESSION_SECRET is not defined');
// }
const SESSION_SECRET = process.env[`SESSION_SECRET_${ENV_SUFFIX}`]!;

// const EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP = process.env[
//   `EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP_${ENV_SUFFIX}`
// ]
//   ? parseInt(
//       process.env[`EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP_${ENV_SUFFIX}`]!,
//       10,
//     )
//   : 100;

// const EXPRESS_RATE_LIMIT_MINUTE = process.env[
//   `EXPRESS_RATE_LIMIT_MINUTE_${ENV_SUFFIX}`
// ]
//   ? parseInt(process.env[`EXPRESS_RATE_LIMIT_MINUTE_${ENV_SUFFIX}`]!, 10)
//   : 5;

const CONSTANTS = {
  AWS_BUCKET,
  ENV_SUFFIX,
  REDIS_HOST,
  REDIS_PORT,
  SESSION_SECRET,
  // EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP,
  // EXPRESS_RATE_LIMIT_MINUTE,
};
export { CONSTANTS };
