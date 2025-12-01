const axios = require("axios");
const { questionAnswerPrompt, conceptExplainPrompt } = require("./prompts.js");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ✅ Generic Groq request function
const askGroq = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
     console.log("✅ Groq Response:", response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Groq API Error:", error.response?.data || error.message);
    throw new Error("Groq API request failed");
  }
};

// ✅ Generate Interview Q&A
const generateInterviewQuestions = async (role, experience, topicsToFocus, numberOfQuestions) => {
  const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
  const result = await askGroq(prompt);

  try {
    return JSON.parse(result);
  } catch (err) {
    console.error("❌ JSON Parse Error (Interview Q&A):", err.message);
    throw new Error("Failed to parse Groq response for interview Q&A");
  }
};

// ✅ Explain a Concept
const explainConcept = async (question) => {
  const prompt = conceptExplainPrompt(question);
  const result = await askGroq(prompt);

  try {
    return JSON.parse(result);
  } catch (err) {
    console.error("❌ JSON Parse Error (Concept Explanation):", err.message);
    throw new Error("Failed to parse Groq response for concept explanation");
  }
};

module.exports = { generateInterviewQuestions, explainConcept };
