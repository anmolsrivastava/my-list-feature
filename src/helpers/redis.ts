import Redis from 'ioredis';

//URL Format -> redis://<REDIS_USER>:<REDIS_PASSWORD>@<REDIS_HOST>:<REDIS_PORT>
const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.on('error', (error: Error) => {
  console.error('Redis connection error:', error);
});

export default redisClient;
