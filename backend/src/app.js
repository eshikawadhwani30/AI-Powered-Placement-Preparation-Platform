import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { getDBStatus } from './config/db.js';
import { getGeminiClient } from './config/gemini.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Secure HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for JWT tokens stored in HttpOnly cookies
app.use(cookieParser());

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Global API Rate Limiter (200 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', globalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const db = getDBStatus();
  const geminiConfigured = Boolean(getGeminiClient());

  res.status(200).json({
    success: true,
    message: 'AI Placement Preparation Platform API is running smoothly',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: db,
    services: {
      geminiConfigured,
      geminiModel: 'gemini-1.5-flash',
    },
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI-Powered Placement Preparation Platform Backend API',
    docs: '/api/health',
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
