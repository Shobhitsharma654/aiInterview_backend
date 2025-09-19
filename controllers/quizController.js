const { GoogleGenAI } = require("@google/genai");
const { quizPrompt } = require("../utils/prompts");
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateStandaloneQuiz = async (req, res) => {
  try {
    const { topic, numberOfQuestions } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const prompt = quizPrompt(topic, numberOfQuestions || 5);

    // 🔹 Call Gemini
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // 🔹 Extract text safely
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!text) {
      return res.status(500).json({ message: "Gemini returned no text output" });
    }

    let quiz;
    try {
      quiz = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("Parse error:", err, "\nRaw Gemini output:", text);
      return res.status(500).json({ message: "Invalid response from Gemini" });
    }

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
