// taken from https://github.com/badunk/multer-s3/blob/master/test/util/mock-s3.js
const events = require('events');
const concat = require('concat-stream');

interface IOpts {
  [key: string]: any;
  credentials: any;
}
function S3(obj: IOpts) {
  function upload(opts: any) {
    const ee = new events.EventEmitter();

    ee.send = function send(cb: any) {
      opts.Body.pipe(
        concat((body: any) => {
          ee.emit('httpUploadProgress', { total: body.length });
          cb(null, {
            ETag: 'mock-etag',
            Location: 'mock-location',
          });
        }),
      );
    };

    return ee;
  }

  return { upload };
}
function Credentials(obj: IOpts) {
  return obj;
}
module.exports = { S3, Credentials };
