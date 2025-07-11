const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/ai/summary
// @desc    Generate book summary using Gemini AI
exports.generateSummary = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title && !description) {
    const err = new Error("Title or description is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Summarize the following book:\n\nTitle: ${title}\n\nDescription: ${description}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
};
