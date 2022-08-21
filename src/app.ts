// external dependencies
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config();
require('express-async-errors');

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
import notFoundMiddleware from './middlewares/not-found.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

import authMiddleware from './middlewares/auth.middleware';

// External Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
import authRouter from './routes/auth.route';
import threadRouter from './routes/thread.route';
import gymRouter from './routes/gym.route';
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/gym', authMiddleware, gymRouter);
app.use('/api/v1/thread', authMiddleware, threadRouter);

app.get('/api/v1/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`[*] Server listening on port ${port}`);
});