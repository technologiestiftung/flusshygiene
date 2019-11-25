import { IConstants } from '.';

const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

let AWS_BUCKET: string;
if (process.env[`AWS_BUCKET_${ENV_SUFFIX}`] === undefined) {
  throw new Error(`"AWS_BUCKET_${ENV_SUFFIX}" is undefined`);
} else {
  AWS_BUCKET = process.env[`AWS_BUCKET_${ENV_SUFFIX}`]!;
}
const REDIS_PORT =
  process.env.REDIS_PORT !== undefined
    ? parseInt(process.env.REDIS_PORT)
    : 6379;
if (process.env[`REDIS_HOST_${ENV_SUFFIX}`] === undefined) {
  throw new Error('REDIS_HOST is not defiend');
}
const REDIS_HOST = process.env[`REDIS_HOST_${ENV_SUFFIX}`]!;

if (process.env[`SESSION_SECRET_${ENV_SUFFIX}`] === undefined) {
  throw new Error('SESSION_SECRET is not defiend');
}
const SESSION_SECRET = process.env[`SESSION_SECRET_${ENV_SUFFIX}`]!;
const CONSTANTS: IConstants = {
  AWS_BUCKET,
  ENV_SUFFIX,
  REDIS_HOST,
  REDIS_PORT,
  SESSION_SECRET,
};
export { CONSTANTS };
