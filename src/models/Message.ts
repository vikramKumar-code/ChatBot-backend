import mongoose, { Schema, Document } from "mongoose";
import { MessageRole } from "../types/chat.types.js";

export interface IChatMessage extends Document {
  userId: string;
  conversationId?: string;
  role: "user" | "model";
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IChatMessage>({
  userId: {
    type: String,
    required: true,
    index: true,
  },

  conversationId: {
    type: String,
    required: false,
    index: true,
  },

  role: {
    type: String,
    enum: ["user", "model"] as MessageRole[],
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

export default mongoose.model<IChatMessage>("Message", messageSchema);
