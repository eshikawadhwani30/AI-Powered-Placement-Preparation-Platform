import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedSampleData } from './utils/seedData.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and seed baseline data
connectDB().then((conn) => {
  if (conn) {
    seedSampleData();
  }
});

// Create HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Placement Prep Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Server Port: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
  // In production, server might be closed gracefully
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception Error]: ${err.message}`);
  process.exit(1);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\n[Server] Gracefully shutting down...');
  server.close(() => {
    console.log('[Server] Closed out remaining connections.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
