import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}
const ai = new GoogleGenAI({ apiKey });
export default ai;
//# sourceMappingURL=gemini.js.map