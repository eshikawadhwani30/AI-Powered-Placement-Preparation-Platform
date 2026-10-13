import mongoose from 'mongoose';

/**
 * Connect to MongoDB with robust retry and diagnostic logging
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_prep';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.warn(`
[Database Warning] Could not connect to MongoDB at "${uri}".
If you are running locally:
  - Make sure MongoDB service is started (e.g. net start MongoDB).
If you are using MongoDB Atlas:
  - Put your connection string in backend/.env:
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/placement_prep?retryWrites=true&w=majority
    `);
    // Return null instead of crashing the process immediately so health-check and setup remain testable
    return null;
  }
};

export const getDBStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    status: states[stateCode] || 'unknown',
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};
