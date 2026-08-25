import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import chatRoutes from "./routes/chat.route.js";
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`Server running on port:${PORT}`);
        });
    }
    catch (error) {
        console.log(`Failed To Start Server: ${error}`);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map