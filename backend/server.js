const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "http://localhost:5173" // Will be updated after deployment
        : "http://localhost:5173",
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
  res.header(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "http://localhost:5173"
      : "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  try {
    const {
      ingredients = [],
      cuisine = "",
      excludes = "",
      timeLimit = "",
      timestamp,
    } = req.body;

    console.log("Received request:", {
      ingredients,
      cuisine,
      excludes,
      timeLimit,
      timestamp,
    });

    // Basic server-side validation for ingredients
    if (!ingredients || ingredients.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide at least one ingredient." });
    }

    // Validate that ingredients are not empty strings
    const validIngredients = ingredients.filter(
      (ing) => ing && ing.trim().length > 0
    );
    if (validIngredients.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide valid ingredients." });
    }

    // Check for specific invalid ingredients
    const invalidIngredients = validIngredients.filter((ing) =>
      ["abcdef", "asdasd"].includes(ing.toLowerCase().trim())
    );
    if (invalidIngredients.length > 0) {
      return res.status(400).json({
        error: `Invalid ingredients: "${invalidIngredients.join(
          ", "
        )}" are not valid food items.`,
      });
    }

    // Limit number of ingredients to 10
    if (validIngredients.length > 10) {
      return res
        .status(400)
        .json({ error: "Please limit the number of ingredients to 10." });
    }

    // Add server-side validation for cuisine
    const validCuisines = [
      "italian",
      "chinese",
      "japanese",
      "indian",
      "mexican",
      "french",
      "thai",
      "spanish",
      "greek",
      "american",
      "korean",
      "vietnamese",
      "mediterranean",
      "middle eastern",
      "caribbean",
      "brazilian",
      "german",
      "british",
      "african",
    ];

    if (cuisine && !validCuisines.includes(cuisine.toLowerCase())) {
      return res.status(400).json({
        error:
          "Invalid cuisine: Please provide a valid cuisine type from the following: " +
          validCuisines.join(", "),
      });
    }

    // Validate time limit is a number between 5 and 1440 (24 hours in minutes)
    if (timeLimit) {
      const timeLimitNum = Number(timeLimit);
      if (
        isNaN(timeLimitNum) ||
        !Number.isInteger(timeLimitNum) ||
        timeLimitNum < 5 ||
        timeLimitNum > 1440
      ) {
        return res.status(400).json({
          error:
            "Invalid time limit: Please provide a whole number between 5 and 1440 minutes.",
        });
      }
    }

    // Parse excludes into an array and filter out empty strings
    const excludeItems = excludes
      ? (Array.isArray(excludes)
          ? excludes
          : excludes.split(",").map((item) => item.trim())
        ).filter((item) => item)
      : [];
    console.log("Parsed exclude items:", excludeItems);

    // Check for specific invalid excludes
    const invalidExcludes = excludeItems.filter((item) =>
      ["abcdef", "asdasd"].includes(item.toLowerCase().trim())
    );
    if (invalidExcludes.length > 0) {
      return res.status(400).json({
        error: `Invalid excludes: "${invalidExcludes.join(
          ", "
        )}" are not valid food items, allergens, or dietary restrictions.`,
      });
    }

    // Check if any ingredient is in excludes
    const commonItems = validIngredients.filter((ing) =>
      excludeItems.some(
        (exclude) => ing.toLowerCase().trim() === exclude.toLowerCase().trim()
      )
    );

    if (commonItems.length > 0) {
      return res.status(400).json({
        error: `The following items cannot be both ingredients and excludes: ${commonItems.join(
          ", "
        )}`,
      });
    }

    if (!GOOGLE_AI_API_KEY) {
      console.error("No API key found");
      return res.status(500).json({ error: "API key not configured" });
    }

    // Use timestamp to create a unique seed for randomization
    const randomSeed = timestamp
      ? parseInt(timestamp.toString().slice(-4))
      : Math.floor(Math.random() * 10000);

    let promptText = `Generate a completely different recipe with a unique name and the following format:
    - Dish Name: (must be unique and different from previous recipes)
    - Short Description:
    - Ingredients (each ingredient on a new line):
    - Step-by-step Instructions (each step on a new line):

    IMPORTANT: Each section header MUST start with "- " and be on its own line. The response format must be exactly:
    - Dish Name: [name]
    - Short Description: [description]
    - Ingredients:
    [ingredients, one per line]
    - Step-by-step Instructions:
    [instructions, one per line]

    Use these ingredients: ${validIngredients.join(", ")}.`;

    // Add input validation
    promptText += ` IMPORTANT: First validate ALL inputs before proceeding. You MUST check each input and respond with an error message if ANY of them are invalid:

    1. For ingredients list:
       - If it contains meaningless items (random words, numbers, or non-food items), respond ONLY with "Invalid ingredients: Please provide actual food items."
       - If it contains non-food items (like "abcdef", "asdasd", "123", "xyz", random letters, numbers, or non-food items), respond ONLY with "Invalid ingredients: Please provide actual food items."
       - If items are not suitable for cooking (like inedible items), respond ONLY with "Invalid ingredients: Please provide edible food items."
       - If fewer than 1 meaningful ingredient, respond ONLY with "Invalid ingredients: Please provide at least 1 meaningful ingredient."
       - Common food items like fruits, vegetables, meats, dairy, grains, etc. are valid ingredients.
       - Single ingredients like "tomatoes", "chicken", "rice" are valid ingredients.
       - The ingredients provided are: ${validIngredients.join(
         ", "
       )}. These are valid ingredients.

    2. For excludes list (if provided):
       - Check each exclude item individually: ${excludeItems.join(", ")}
       - If ANY item is meaningless (like "abcdef", "asdasd", "123", "xyz", random letters, numbers, or non-food items), respond ONLY with "Invalid excludes: Please provide actual food items, allergens, or dietary restrictions."
       - Each exclude item must be a real food item (like "nuts", "dairy", "eggs"), allergen (like "gluten", "peanuts"), or dietary restriction (like "vegetarian", "vegan").
       - Examples of valid excludes: nuts, dairy, eggs, gluten, peanuts, shellfish, soy, wheat, vegetarian, vegan, kosher, halal
       - Examples of invalid excludes: abcdef, 123, xyz, random words, non-food items
       - Do not proceed if even one exclude item is invalid.
       - Empty exclude items should be ignored.

    3. For cuisine type (if provided):
       - If not one of: ${validCuisines.join(
         ", "
       )}, respond ONLY with "Invalid cuisine: Please provide a valid cuisine type from the list."

    4. For time limit (if provided):
       - If not between 5 minutes and 24 hours, respond ONLY with "Invalid time limit: Please provide a reasonable cooking time between 5 minutes and 24 hours."

    You MUST validate ALL inputs first. If ANY validation fails, respond ONLY with the corresponding error message. Do not generate a recipe if there are ANY invalid inputs.`;

    if (cuisine) {
      promptText += ` Cuisine preference: ${cuisine}.`;
    }
    if (excludeItems.length > 0) {
      promptText += ` Exclude these items/preferences: ${excludeItems.join(
        ", "
      )}.`;
    }
    if (timeLimit) {
      promptText += ` Make sure it can be prepared within ${timeLimit} minutes.`;
    }

    // Add randomization based on timestamp
    promptText += ` If ALL inputs are valid: Be creative and generate a completely different recipe than before. Use different cooking techniques, flavor combinations, and presentation styles. The dish name must be unique and different from any previous recipes. Use the random seed ${randomSeed} to ensure uniqueness.`;

    // Enforce step-by-step instructions format without numbering
    promptText += ` IMPORTANT: You MUST provide clear step-by-step instructions. Each step should be on a new line without any numbering or bullet points. Each step should be a complete sentence that can be followed independently. Do not combine multiple steps into one. The instructions must be detailed enough for someone to follow them without prior knowledge.`;

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

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const recipeText = response.data.candidates[0].content.parts[0].text;

      console.log("Raw Recipe Text:", recipeText);

      // Check for error messages in the response
      if (
        recipeText.includes("Invalid ingredients:") ||
        recipeText.includes("Invalid cuisine:") ||
        recipeText.includes("Invalid time limit:") ||
        recipeText.includes("Invalid excludes:")
      ) {
        // Extract the full error message
        const errorMatch = recipeText.match(
          /Invalid (?:ingredients|cuisine|time limit|excludes):[^.]*/
        );
        const errorMessage = errorMatch ? errorMatch[0] : recipeText;
        console.log("Validation error detected:", errorMessage);
        return res.status(400).json({ error: errorMessage });
      }

      // If the response doesn't contain any recipe sections, it's likely an error
      if (
        !recipeText.includes("Dish Name:") ||
        !recipeText.includes("Short Description:") ||
        !recipeText.includes("Ingredients:") ||
        !recipeText.includes("Instructions:")
      ) {
        console.log(
          "Response missing recipe sections, likely an error message:",
          recipeText
        );
        return res
          .status(400)
          .json({ error: "Invalid response from AI. Please try again." });
      }

      const lines = recipeText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      let recipe = {
        name: "",
        description: "",
        ingredients: [],
        instructions: [],
      };
      let section = "";

      // If we get an empty recipe after parsing, it means the AI returned an error message
      // that wasn't caught by the previous check
      if (lines.length === 0) {
        console.log("Empty recipe detected, likely an error message");
        return res.status(400).json({
          error: "Invalid input: Please check your ingredients and excludes.",
        });
      }

      lines.forEach((line) => {
        if (line.includes("Dish Name:")) {
          recipe.name = line
            .replace("Dish Name:", "")
            .replace("- Dish Name:", "")
            .replace(/^-/, "")
            .trim();
          section = "description";
        } else if (line.includes("Short Description:")) {
          recipe.description = line
            .replace("Short Description:", "")
            .replace("- Short Description:", "")
            .replace(/^-/, "")
            .trim();
          section = "ingredients";
        } else if (line.includes("Ingredients:")) {
          section = "ingredients";
        } else if (line.includes("Step-by-step Instructions:")) {
          section = "instructions";
        } else if (section === "ingredients") {
          // Only add non-empty lines that aren't section headers
          if (
            line &&
            !line.includes("Dish Name:") &&
            !line.includes("Short Description:") &&
            !line.includes("Ingredients:") &&
            !line.includes("Step-by-step Instructions:")
          ) {
            recipe.ingredients.push(line.replace(/^-/, "").trim());
          }
        } else if (section === "instructions") {
          // Add any non-empty line that isn't a section header
          if (
            line &&
            !line.includes("Dish Name:") &&
            !line.includes("Short Description:") &&
            !line.includes("Ingredients:") &&
            !line.includes("Step-by-step Instructions:")
          ) {
            recipe.instructions.push(line.replace(/^-/, "").trim());
          }
        }
      });

      // Validate that we have all required sections
      if (
        !recipe.name ||
        !recipe.description ||
        recipe.ingredients.length === 0 ||
        recipe.instructions.length === 0
      ) {
        console.error("Missing required recipe sections:", recipe);
        console.error("Original response text:", recipeText);
        return res.status(400).json({
          error:
            "AI response missing required recipe sections. Please try again.",
        });
      }

      console.log("Parsed Recipe:", recipe);
      res.json({ recipe });
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
