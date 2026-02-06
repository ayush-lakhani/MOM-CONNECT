const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
const { redisClient, isRedisConnected } = require('../config/redis');

let rateLimiter;

const setupLimiter = () => {
  if (isRedisConnected()) {
    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'middleware',
      points: 100,
      duration: 60,
    });
    console.log('🚀 Using Redis Rate Limiter');
  } else {
    rateLimiter = new RateLimiterMemory({
      points: 100,
      duration: 60,
    });
    console.log('🐌 Using Memory Rate Limiter (No Redis)');
  }
};

const rateLimiterMiddleware = (req, res, next) => {
  if (!rateLimiter) setupLimiter();
  
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

module.exports = rateLimiterMiddleware;
