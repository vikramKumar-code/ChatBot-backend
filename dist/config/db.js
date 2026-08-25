import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined");
        }
        const conn = await mongoose.connect(mongoUri);
        console.log(`Database Connected Successfully: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Failed To Connect DataBase: ${error}`);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map