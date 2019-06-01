// https://menno.io/posts/listing-s3-objects-with-nodejs/
import AWS from 'aws-sdk';
export const allBucketKeys = async (s3: AWS.S3, bucket: string, prefix: string) => {
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucket,
    Prefix: prefix,
  };

  let keys: string[] = [];
  for (; ;) {

  const data = await s3.listObjectsV2(params).promise();

  if (data.Contents !== undefined) {
   keys = keys.concat(data.Contents!.map(ele => ele.Key!));
  }

  //   data.Contents.forEach((elem: IObject) => {
  //     keys = keys.concat(elem.Key);
  //   });

  if (!data.IsTruncated) {
    break;
  }
  params.ContinuationToken = data.NextContinuationToken;
  // params.Marker = data.NextMarker;
  }

  return keys;
};
