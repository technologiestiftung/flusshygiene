// import redis, { ClientOpts } from 'redis';
// const opts: ClientOpts = {
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port:
//     process.env.REDIS_PORT === undefined
//       ? 6379
//       : parseInt(process.env.REDIS_PORT, 10),
//   retry_strategy: () => 1000,
// };
// const redisClient = redis.createClient(opts);
// const sub = redisClient.duplicate();

// export const pubsub = async () => {
//   try {
//     sub.on('message', (channel, message) => {
//       console.log(`Redis Channel ${channel} => ${message}\n`);
//     });
//     sub.on('connect', () => {
//       console.log('sub is connected');
//     });
//     sub.subscribe('hello');
//   } catch (err) {
//     throw err;
//   }
// };
