const Redis = require('ioredis');
require('dotenv').config();

let redisClient = null;
let subClient = null;
let isRedisConnected = false;

try {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 1) return null; // stop retrying after 1 time for dev
      return 2000;
    }
  });
  subClient = redisClient.duplicate();

  redisClient.on('connect', () => {
    console.log('✅ Redis Connected');
    isRedisConnected = true;
  });

  redisClient.on('error', (err) => {
    console.error('⚠️ Redis Client Warning:', err.message);
    isRedisConnected = false;
  });

} catch (e) {
  console.error('⚠️ Redis Initialization Failed:', e.message);
}

module.exports = { redisClient, subClient, isRedisConnected: () => isRedisConnected };
