import { NextFunction, Request, Response } from "express";
import redisClient from "../config/redis.js";

const MAX_REQUESTS = 20;
const WINDOWS_SECONDS = 60;

export const chatRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req.body.userId as string) || req.ip || "anonymous";
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
  } catch (error) {
    console.error(`Rate Limiter Error: ${error}`);
    next();
  }
};
