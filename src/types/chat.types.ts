export interface ChatRequestBody {
  message: string;
  userId: string;
  conversationId?: string;
}

export interface ChatResponseBody {
  reply: string;
}

export interface ErrorResponseBody {
  error: string;
}

export type MessageRole = "user" | "model";

export interface ChatHistoryItem {
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface GeminiHistoryItem {
  role: MessageRole;
  parts: { text: string }[];
}
