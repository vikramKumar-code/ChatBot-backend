import type { Request, Response } from "express";
import crypto from "crypto";
import ai from "../config/gemini.js";
import Message from "../models/Message.js";
import type { ChatRequestBody } from "../types/chat.types.js";

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { message, userId, conversationId } = req.body as ChatRequestBody;

    if (!message || !userId) {
      res.status(400).json({
        message: "All Fields Are Required",
      });
      return;
    }

    const activeConversationId = conversationId || crypto.randomUUID();

    await Message.create({
      userId,
      conversationId: activeConversationId,
      role: "user",
      content: message,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
    });

    const reply = response.text || "";

    await Message.create({
      userId,
      conversationId: activeConversationId,
      role: "model",
      content: reply,
    });

    res.json({ reply, conversationId: activeConversationId });
  } catch (error) {
    console.error(`Chat Error: ${error}`);
    res.status(500).json({ error: error });
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { conversationId } = req.query;

    const query: any = { userId };
    if (conversationId) {
      if (conversationId === "legacy") {
        query.conversationId = { $in: [null, undefined] };
      } else {
        query.conversationId = conversationId;
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // Convert descending messages to chronological order for client consumption
    const sortedMessages = [...messages].reverse();

    res.status(200).json({ messages: sortedMessages });
  } catch (error) {
    console.log(`Fetch History Error: ${error}`);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;

    const conversations = await Message.aggregate([
      { $match: { userId } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$conversationId",
          title: { $first: "$content" },
          createdAt: { $last: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const formattedConversations = conversations.map((conv) => {
      const id = conv._id || "legacy";
      let title = conv.title || "Untitled Conversation";
      // Truncate title if too long
      if (title.length > 40) {
        title = title.substring(0, 37) + "...";
      }
      return {
        id,
        title,
        createdAt: conv.createdAt,
      };
    });

    res.status(200).json({ conversations: formattedConversations });
  } catch (error) {
    console.error(`Fetch Conversations Error: ${error}`);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, conversationId } = req.params;

    const query: any = { userId };
    if (conversationId === "legacy") {
      query.conversationId = { $in: [null, undefined] };
    } else {
      query.conversationId = conversationId;
    }

    await Message.deleteMany(query);
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error(`Delete Conversation Error: ${error}`);
    res.status(500).json({ error: "Something went wrong" });
  }
};
