import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ["user", "model"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model("Message", messageSchema);
//# sourceMappingURL=Message.js.map