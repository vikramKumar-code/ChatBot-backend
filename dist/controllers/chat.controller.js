import ai from "../config/gemini.js";
import Message from "../models/Message.js";
export const sendMessage = async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!message || !userId) {
            res.status(400).json({
                message: "All Fields Are Required",
            });
            return;
        }
        await Message.create({
            userId,
            role: "user",
            content: message,
        });
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message,
        });
        const reply = response.text || "";
        await Message.create({ userId, role: "model", content: reply });
        res.json({ reply });
    }
    catch (error) {
        console.error(`Chat Error: ${error}`);
        res.status(500).json({ error: "Something went wrong" });
    }
};
export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ messages });
    }
    catch (error) {
        console.log(`Fetch History Error: ${error}`);
        res.status(500).json({ error: "Something went wrong" });
    }
};
//# sourceMappingURL=chat.controller.js.map