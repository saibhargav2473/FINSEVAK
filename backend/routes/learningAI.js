const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

router.post('/explain', async (req, res) => {
  try {
    const { question, options, correctIndex, selectedIndex } = req.body;
    if (
      typeof question !== 'string' ||
      !Array.isArray(options) ||
      typeof correctIndex !== 'number' ||
      typeof selectedIndex !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI explanations are not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const labels = ['A', 'B', 'C', 'D'];
    const optionLines = options.map((o, i) => `${labels[i]}) ${o}`).join('\n');

    const prompt = `You are a concise financial literacy tutor.

Question: ${question}

Options:
${optionLines}

The correct answer is option ${labels[correctIndex]}.
The learner chose option ${labels[selectedIndex]} (incorrect).

Write 2–4 short sentences in plain English: explain why the correct answer is right, and briefly what the wrong choice confuses. No markdown, no bullet points, no greeting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ explanation: text.trim() });
  } catch (error) {
    console.error('Learning explain error:', error);
    res.status(500).json({ error: error.message || 'Explanation failed' });
  }
});

module.exports = router;
