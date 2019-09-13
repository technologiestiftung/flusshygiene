import express from 'express';
import Router from 'express-promise-router';

const app = express();
const router = Router();

router.get('/health', async (_req, res) => {
  res.json({ ready: true });
});

// app.use(cors())
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('combined'));
// } else {
//   app.use(helmet());
//   app.use(morgan('combined'));
// }
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/', router);
export default app;
