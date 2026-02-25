const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

router.post('/', async (req, res) => {
  try {
    const { income, expenses, goal, customQuestion } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const prompt = `
You are a helpful and practical financial advisor.

User details:
- Monthly income: ₹${income}
- Monthly expenses: ₹${expenses}
- Monthly savings goal: ₹${goal}

Provide specific advice on how they can meet their savings goal.
Also give budgeting tips.

Additional question: "${customQuestion || "None"}"
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ answer: text });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;