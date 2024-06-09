import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import redisClient from './helpers/redis';
import router from './router';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(helmet());

// Whitelisted Domains
const whitelist = ['http://example1.com', 'http://example2.com'];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// MongoDB Connection
const testMongoDBConnection = async () => {
  return new Promise((resolve, reject) => {
    const MONGO_URL = process.env.MONGO_URL as string;
    mongoose.Promise = Promise;
    mongoose.connect(MONGO_URL);

    mongoose.connection.on('error', (error: Error) => {
      console.log(error);
      reject(error);
    });

    mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB');
      resolve(true);
    });
  });
};

// Redis connection
const testRedisConnection = async () => {
  return new Promise((resolve, reject) => {
    if (redisClient.status === 'ready') {
      console.log('Redis is already connected');
      resolve(true);
    } else {
      redisClient.once('connect', () => {
        console.log('Connected to Redis');
        resolve(true);
      });

      redisClient.once('error', (error: Error) => {
        console.log('Redis connection error:', error);
        reject(error);
      });

      if (redisClient.status !== 'connecting') {
        redisClient.connect();
      }
    }
  });
};

//Start Server
const startServer = async () => {
  try {
    await testMongoDBConnection();
    await testRedisConnection();

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database(s):', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    redisClient.quit();
    console.log('Disconnected from Redis');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for SIGINT and SIGTERM signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.use('/', router());

// Start the server
startServer();
