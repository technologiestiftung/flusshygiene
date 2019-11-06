import { s3 as awss3 } from '../lib/s3';
import { S3 } from 'aws-sdk';

(async () => {
  const params: S3.Types.DeleteObjectRequest = {
    Bucket: 'flusshygiene-dev',
    Key: '19/07/02/raa01-sf_10000-1907020450-dwd---bin',
  };
  await awss3.deleteObject(params).promise();
})();
