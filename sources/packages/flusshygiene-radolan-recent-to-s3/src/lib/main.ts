import AWS from 'aws-sdk';
import { config } from 'dotenv';
import fs from 'fs';
import mailgun from 'mailgun-js';
import mkdirp from 'mkdirp';
import path from 'path';
import pipe from 'pipe-io';
import ftp from 'promise-ftp';
import rimraf from 'rimraf';
import s3 from 's3-client';
import util from 'util';
import zlib from 'zlib';
import { allBucketKeys } from './all-bucket-keys';
import { IObject } from './interfaces';
import { logger } from './logger';
import { radolanFilenameParser } from './radolan-file-name-parser';
import { shutDownEC2 } from './shutdown-ec2';
import { stringArrayDiff } from './string-array-diff';

const mkdirpAsync = util.promisify(mkdirp);
// const readDirAsync = util.promisify(fs.readdir);
// const finishedAsync = util.promisify(stream.finished);
const rimrafAsync = util.promisify(rimraf);

config({ path: path.resolve(__dirname, '../../.env') });
const ftpOpts: ftp.Options = {
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT!, 10),
};
const ftpClient = new ftp();

const credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
const awsS3Client = new AWS.S3({
  credentials,
  region: process.env.AWS_REGION || 'eu-central-1',
});

const options = {
  s3Client: awsS3Client,
  // more options available. See API docs below.
};
const s3Client = s3.createClient(options);
// the hard coded path is currently need to not kill the existing task
const radolanRootPath = process.env.FTP_RADOLAN_PATH || 'pub/CDC/grids_germany/hourly/radolan/recent/bin';

const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY!, domain: process.env.MAILGUN_DOMAIN!});

const errorLogger = (error: Error, obj?: any) => {
  if (obj !== undefined) {
    logger.error(`${JSON.stringify(obj)}\n`);
  }
  logger.error(`${error.message}\n`);
  logger.error(`${error.stack}\n`);
  logger.error(`${error}\n`);
};

export const main: (options: IObject) => Promise<void> = async (_options) => {
  try {
    logger.info(`FTP Host ${process.env.FTP_HOST}`);
    logger.info(`FTP Port ${process.env.FTP_PORT}` );
    logger.info(`Bucket name ${process.env.AWS_BUCKET_NAME}`);

    // extract the last two digits from the year.
    // This is Y3K save :D
    const year = (new Date()).getFullYear().toString().substr(2);
    const s3List = await allBucketKeys(awsS3Client, process.env.AWS_BUCKET_NAME!, year);
    const s3DiffList4Diff = s3List.map(ele => ele.split('/')[ele.split('/').length - 1]);
    const ftpResponse = await ftpClient.connect(ftpOpts); // tslint:disable-line: await-promise
    logger.info(`FTP connection response ${ftpResponse}`);
    const rawFtpList = await ftpClient.list(radolanRootPath);
    // await ftpClient.end();
    const ftpList4Diff = rawFtpList
      .filter(ele => ele.name.indexOf('.gz') !== -1)
      .map((ele => ele.name.replace('.gz', '')));
      // diffing is from here https://stackoverflow.com/a/33034768
    // const ftpDiffList = ftpList4Diff.filter(ele => !s3DiffList4Diff.includes(ele));
    const ftpDiffList = stringArrayDiff(ftpList4Diff, s3DiffList4Diff);
    logger.info(`Missing elements: ${JSON.stringify(ftpDiffList)}`);

    // fs.writeFileSync(path.resolve(process.cwd(), './ftpList4Diff.txt'), ftpList4Diff, 'utf8');
    // fs.writeFileSync(path.resolve(process.cwd(), './ftpList4Diff.txt'), ftpList4Diff, 'utf8');
    // fs.writeFileSync(path.resolve(process.cwd(), './missing.log'), ftpDiffList, 'utf8');
    // process.exit();
    const ftpList = ftpDiffList.map(ele => `${ele}.gz`);
    logger.info(`Preparing transfer for the following files:,
    ${ftpList} on ${process.env.FTP_HOST} to ${process.env.AWS_BUCKET_NAME}`);

    // const truncateftplist = ftpList.slice(0, 50);
    const transferTasks = ftpList.map((file: string) => new Promise(async (resolve, reject) => {
      // const ftprestask = await ftpClient.connect(ftpOpts); // tslint:disable-line: await-promise
      // logger.info(ftprestask);
      const fileInfo = radolanFilenameParser(file);
      logger.info(`radolan file infos ${JSON.stringify(fileInfo)}`);
      const { year, month, day, hour, minute } = fileInfo.groups;
      const tmpFolderPath = path.resolve(process.cwd(), `./tmp/${year}${month}${day}${hour}${minute}`);
      await mkdirpAsync(tmpFolderPath);
      const outfile = file.replace('.gz', '');
      const ftprstream = await ftpClient.get(`${radolanRootPath}/${file}`);
      const fswstream = fs.createWriteStream(`${tmpFolderPath}/${outfile}`);
      logger.info(`Gunzip to fs ${JSON.stringify(file)}`);
      pipe(
        [
          ftprstream,
          zlib.createGunzip(),
          fswstream,
        ], (err: Error) => {
          if (err) {
            errorLogger(err, 'Error piping from ftp > gunzip > fs');

            reject();

          } else {
            const key = `${fileInfo.groups.year}/${fileInfo.groups.month}/${fileInfo.groups.day}/${outfile}`;
            const params = {
              localFile: `${tmpFolderPath}/${outfile}`,
              // deleteRemoved: true, // default false, whether to remove s3 objects
              // that have no corresponding local file.
              s3Params: {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${key}`,
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
              },
            };
            logger.info(`Preparing upload for: ${params.localFile} to ${key}`);

            const uploader = s3Client.uploadFile(params);

            uploader.on('error', (errul: Error) => {
              errorLogger(errul);
              reject();
            });
            uploader.once('progress', () => {
              logger.info(`Uploading: ${params.localFile}`);
            });
            uploader.on('end', () => {
              logger.info(`\ndone uploading: ${params.localFile}`);
              fs.unlinkSync(params.localFile);
              rimraf.sync(tmpFolderPath);
              resolve();
            });
          }
        });
    }));
    await Promise.all(transferTasks).catch(err => {
      errorLogger(err, 'Error in promise all transferTask');
    });
    await ftpClient.end();
    await rimrafAsync(path.resolve(process.cwd(), './tmp'));
    const clog = fs.readFileSync(path.resolve(process.cwd(), './combined.log'), 'utf8');
    const elog = fs.readFileSync(path.resolve(process.cwd(), './error.log'), 'utf8');

    const mailData = {
      from: `Mailgun Sandbox <${process.env.MAILGUN_FROM}>`,
      subject: `Radoloan recent `,
      text: `${clog}\n${elog}`,
      to: `${process.env.MAILGUN_TO}`,
    };
    mg.messages().send(mailData,  (merror, body) => {
      if (merror) {
        logger.error(merror);
      }
      logger.info(`Mailgun ${JSON.stringify(body)}`);
    });
    logger.info('Done. Shutting down?');
    shutDownEC2(process.env.AWS_EC2_INSTANCE_ID);
  } catch (error) {
    await ftpClient.end();
    errorLogger(error, 'Default error');
    await ftpClient.destroy();
  }
};
