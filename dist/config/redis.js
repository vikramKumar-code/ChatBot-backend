import { createClient } from "redis";
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (error) => {
    console.log(`Redis Error: ${error}`);
});
redisClient.on("connect", () => {
    console.log("Redis Connecting...");
});
export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis Connected Successfully");
    }
    catch (error) {
        console.log(`Redis Connection Fail: ${error}`);
        process.exit(1);
    }
};
export default redisClient;
//# sourceMappingURL=redis.js.map