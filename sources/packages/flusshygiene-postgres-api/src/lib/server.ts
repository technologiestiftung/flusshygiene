import http from 'http';
import app from './app';

const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

const PORT: number|string = process.env[`POSTGRES_EXPRESS_PORT_${ENV_SUFFIX}`] || 5004;

const server = http.createServer(app);
server.listen(PORT, ()=>{
  if(process.env.NODE_ENV === 'development'){
    process.stdout.write(`listening on http://localhost:${PORT}\n`);
  }
});
