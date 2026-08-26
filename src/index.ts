import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import chatRoutes from "./routes/chat.route.js";

const PORT: number = parseInt(process.env.PORT || "3000");
const HOST: string = process.env.HOST || "0.0.0.0";
const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/chat", chatRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, HOST, (): void => {
      console.log(`Server running on port:${PORT}`);
    });
  } catch (error) {
    console.log(`Failed To Start Server: ${error}`);
    process.exit(1);
  }
};

startServer();
