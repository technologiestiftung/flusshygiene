import { config } from 'dotenv';
import meow from 'meow';
import path from 'path';
import {logger} from './lib/logger';
import { main } from './lib/main';

const cli = meow(`Usage`, {flags: {}});
config({ path: path.resolve(__dirname, '../.env') });

const options = {inputs: cli.input, flags: cli.flags};
logger.info('Options', options);
main(options).catch( err => {
  logger.error(err);
  // process.stderr.write(`${JSON.stringify(err)}\n`);
});
