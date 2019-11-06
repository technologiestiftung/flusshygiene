const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

let AWS_BUCKET: string;
if (process.env[`AWS_BUCKET_${ENV_SUFFIX}`] === undefined) {
  throw new Error(`"AWS_BUCKET_${ENV_SUFFIX}" is undefined`);
} else {
  AWS_BUCKET = process.env[`AWS_BUCKET_${ENV_SUFFIX}`]!;
}

interface IConstants {
  AWS_BUCKET: string;
  ENV_SUFFIX: string;
}
const CONSTANTS: IConstants = {
  AWS_BUCKET,
  ENV_SUFFIX,
};
export { CONSTANTS };
