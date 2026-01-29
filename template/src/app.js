import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import rateLimiter from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(rateLimiter(50)); // 50 requests limit per 15 minutes/ you can use this middleware to selected routes
app.use(errorHandler); // error handler middleware

export default app;