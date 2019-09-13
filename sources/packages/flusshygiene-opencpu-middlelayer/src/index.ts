// import { pubsub } from './subscriber';
import http from 'http';
import app from './app';
import WebSocket from 'ws';
import { pubsub } from './subscriber';
// import redis, { ClientOpts } from 'redis';

// const sopts: ServerOptions = {
// port: process.env.WSS_PORT === undefined ? 4003: parseInt(process.env.WSS_PORT),
// }

// const ropts: ClientOpts = {
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port:
//     process.env.REDIS_PORT === undefined
//       ? 6379
//       : parseInt(process.env.REDIS_PORT, 10),
//   retry_strategy: () => 1000,
// };
// const redisClient = redis.createClient(ropts);
// const sub = redisClient.duplicate();
// const pub = redisClient.duplicate();

// redisClient.on('connect', function() {
//   console.log('connected');
// });
// redisClient.on('subscribe', (_channel, _count) => {
//   console.log('we have subscribers');
// });
// export const pubsub = async () => {
// try {
// sub.on('message', (channel, message) => {
//   console.log(`Redis Channel ${channel} => ${message}\n`);
// });
// sub.on('connect', () => {
//   console.log('sub is connected');
// });
// setInterval(() => {
//   pub.publish('hello', 'boom');
// }, 1000);

// sub.subscribe('hello');
// console.log(sub.connected);
// } catch (err) {
// throw err;
// }
// };

const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

const PORT: number | string =
  process.env[`REDIS_EXPRESS_PORT_${ENV_SUFFIX}`] || 4004;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send('welcome from backend WebSocketServer');
});
server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `server listening on http://localhost:${PORT}\n`,
      `wss listening on ws://localhost:${PORT}`,
    );
  }
});

pubsub().catch((err) => {
  throw err;
});
