import {devlogGen} from '@tsb/flusshygiene-utils';
import http from 'http';
import app from './app';


const PORT = process.env.POSTGRES_EXPRESS_PORT || 5004;

const server = http.createServer(app);
const log = devlogGen(PORT)
server.listen(PORT, log);
