import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './api/middlewares/error.middleware.js';
import apiRouter from './api/routes/index.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

// --- Core Middlewares ---
// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Secure HTTP headers
app.use(helmet());

// Logger
app.use(morgan('dev'));

// Body parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// --- API Routes ---
app.use('/api/v1', apiRouter);

// --- Health Check Route ---
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});


// --- Not Found Handler ---
app.use((req, res, next) => {
  next(new ApiError(404, 'Not Found - The route does not exist'));
});

// --- Global Error Handler ---
app.use(globalErrorHandler);


export default app;
