import redisClient from "../config/redis.js";
const MAX_REQUESTS = 5;
const WINDOWS_SECONDS = 60;
export const chatRateLimiter = async (req, res, next) => {
    try {
        const userId = req.body.userId || req.ip || "anonymous";
        const key = `rate_limit: ${userId}`;
        const request = await redisClient.incr(key);
        if (request === 1) {
            await redisClient.expire(key, WINDOWS_SECONDS);
        }
        if (request > MAX_REQUESTS) {
            res.status(429).json({
                error: "Too many requests. Please slow down.",
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error(`Rate Limiter Error: ${error}`);
        next();
    }
};
//# sourceMappingURL=rateLimit.middleware.js.map