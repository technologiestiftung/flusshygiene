/* eslint-disable no-async-promise-executor */
import AWS from "aws-sdk";
import { config } from "dotenv";
import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";

import rimraf from "rimraf";
import s3 from "s3-client";
import util from "util";
import got from "got";
import stream from "stream";
import zlib from "zlib";
import { allBucketKeys } from "./all-bucket-keys";
import { IObject } from "./interfaces";
import { logger } from "./logger";
import { radolanFilenameParser } from "./radolan-file-name-parser";
import { stringArrayDiff } from "./string-array-diff";
import { mail, IMailOpts } from "./mail";
import { getDirectoryListingLinks } from "./directory-listing";
import { isFileZeroByte } from "./zero-size";

const rimrafAsync = util.promisify(rimraf);

config({ path: path.resolve(__dirname, "../../.env") });

const credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
const awsS3Client = new AWS.S3({
  credentials,
  region: process.env.AWS_REGION,
});

const options = {
  s3Client: awsS3Client,
  // more options available. See API docs below.
};
const s3Client = s3.createClient(options);
// const radolanRootPath = process.env.FTP_RADOLAN_PATH;

const errorLogger = (error: Error, obj?: any) => {
  if (obj !== undefined) {
    logger.error(`${JSON.stringify(obj)}\n`);
  }

  logger.error(`${error}\n`);
};

export const main: (options: IObject) => Promise<void> = async _options => {
  try {
    logger.info(`Bucket name ${process.env.AWS_BUCKET_NAME}`);

    // extract the last two digits from the year.
    // This is Y3K save :D
    const year = new Date()
      .getFullYear()
      .toString()
      .substr(2);
    const s3List = await allBucketKeys(
      awsS3Client,
      process.env.AWS_BUCKET_NAME!,
      year,
    );
    const s3DiffList4Diff = s3List.map(
      ele => ele.split("/")[ele.split("/").length - 1],
    );

    // before we had to filter the names to make the diff list
    // since the DWD does not gzip the files anymore on their FTP
    // we don't need to. Lets keeps this here as a reference

    const rawDWDFilesList = await getDirectoryListingLinks({
      baseUrl: process.env.DWD_HTTP_HOST!,
    });

    const dwdList4Diff = rawDWDFilesList
      .filter(ele => ele.indexOf(".gz") !== -1)
      .map(ele => ele.replace(".gz", ""));

    // diffing is from here https://stackoverflow.com/a/33034768
    const filesDiffList = stringArrayDiff(dwdList4Diff, s3DiffList4Diff);
    logger.info(`Missing elements: ${JSON.stringify(filesDiffList)}`);

    // same thing here we had to reattach the .gz to the diffed
    // list to be able to pipe them into the read -> gunzip -> write process
    // now we only read -> write
    const fileList = filesDiffList;
    logger.info(`Preparing transfer for the following files:,
    ${fileList} on ${process.env.FTP_HOST} to ${process.env.AWS_BUCKET_NAME}`);

    const transferTasks = fileList.map(
      (file: string) =>
        new Promise((resolve, reject) => {
          const fileInfo = radolanFilenameParser(file);
          logger.info(`radolan file infos ${JSON.stringify(fileInfo)}`);
          const { year, month, day, hour, minute } = fileInfo.groups;
          const tmpFolderPath = path.resolve(
            process.cwd(),
            `./tmp/${year}${month}${day}${hour}${minute}`,
          );
          mkdirp.sync(tmpFolderPath);
          const outfile = file.replace(".gz", "");
          const inFilePath = `${process.env.DWD_HTTP_HOST!}/${file}.gz`;

          const rstream = got.stream(inFilePath);
          const fswstream = fs.createWriteStream(`${tmpFolderPath}/${outfile}`);
          stream.pipeline(
            rstream,

            zlib.createGunzip(),
            fswstream,

            err => {
              if (err) {
                errorLogger(err, "Error piping from ftp > gunzip > fs");
                reject();
              } else {
                logger.info(`processing file ${outfile}`);
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
                logger.info(
                  `Preparing upload for: ${params.localFile} to ${key}`,
                );

                const uploader = s3Client.uploadFile(params);

                uploader.on("error", (errul: Error) => {
                  errorLogger(errul);
                  reject();
                });
                uploader.once("progress", () => {
                  logger.info(`Uploading: ${params.localFile}`);
                });
                uploader.on("end", () => {
                  logger.info(`\ndone uploading: ${params.localFile}`);

                  resolve(true);
                });
              }
            },
          );
        }),
    );
    await Promise.all(transferTasks).catch(err => {
      errorLogger(err, "Error in promise all transferTask");
    });

    await rimrafAsync(path.resolve(process.cwd(), "./tmp"));
    const clog = fs.readFileSync(
      path.resolve(process.cwd(), "./combined.log"),
      "utf8",
    );
    const eLogPath = path.resolve(process.cwd(), "./error.log");

    if (isFileZeroByte(eLogPath)) {
      return;
    }

    const elog = fs.readFileSync(eLogPath, "utf8");
    // silence
    if (elog.length === 0) {
      return;
    }
    const opts: IMailOpts = {
      // from: process.env.SMTP_FROM!,
      to: process.env.SMTP_ADMIN_TO!,
      port: parseInt(process.env.SMTP_PORT!, 10),
      host: process.env.SMTP_HOST!,
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PW!,
      subject:
        elog.length === 0
          ? "[Flusshygiene] Radolan Recent - {OK}"
          : "[Flusshygiene] Radolan Recent - {ERROR}",
      text: `${
        elog.length === 0 ? "Everything OK." : "ERRORLOG:\n" + elog
      }\n${clog}`,
    };

    await mail(opts);

    logger.info("Done. Shutting down?");
  } catch (error) {
    errorLogger(error, "Default error");
  }
};
