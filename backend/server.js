const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
    exposedHeaders: ["Access-Control-Allow-Origin"],
  })
);

app.use(express.json());

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash"; // ✅ Correct model name
const GOOGLE_AI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GOOGLE_AI_API_KEY}`;

app.post("/recipe", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");

  try {
    const { ingredients } = req.body;
    console.log("Received ingredients:", ingredients);

    if (!ingredients || ingredients.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide at least one ingredient." });
    }

    if (!GOOGLE_AI_API_KEY) {
      console.error("No API key found");
      return res.status(500).json({ error: "API key not configured" });
    }

    const promptText = `Please generate a simple and easy-to-make recipe using the following ingredients: ${ingredients.join(
      ", "
    )}. Provide the dish name, required ingredients, and steps.`;

    console.log("Making request to Google AI API with prompt:", promptText);
    const response = await axios.post(
      GOOGLE_AI_ENDPOINT,
      {
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(
      "Full Google AI Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0].content
    ) {
      res.json({ recipe: response.data.candidates[0].content });
    } else {
      console.error("Invalid API response structure:", response.data);
      res.status(500).json({ error: "AI API did not return a valid result." });
    }
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error response:", error.response?.data);
    res.status(500).json({
      error:
        error.response?.data?.error ||
        error.message ||
        "Server error, please try again later.",
    });
  }
});

app.options("/recipe", cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
