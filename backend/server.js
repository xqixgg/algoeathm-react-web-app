const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash"; // ✅ Correct model name
const GOOGLE_AI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GOOGLE_AI_API_KEY}`;

app.post("/recipe", async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ error: "Please provide at least one ingredient." });
        }

        const promptText = `Please generate a simple and easy-to-make recipe using the following ingredients: ${ingredients.join(", ")}. Provide the dish name, required ingredients, and steps.`;

        const response = await axios.post(
            GOOGLE_AI_ENDPOINT,
            {
                contents: [
                    {
                        parts: [{ text: promptText }]
                    }
                ]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        if (response.data && response.data.candidates) {
            res.json({ recipe: response.data.candidates[0].content });
        } else {
            res.status(500).json({ error: "AI API did not return a valid result." });
        }
    } catch (error) {
        console.error("Error calling Google AI API:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || "Server error, please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
