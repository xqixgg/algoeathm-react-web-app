import "./index.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecipe } from "../store/RecipeContext"; // Import global store
import axios from "axios";
import { useState } from "react";

/**
 * Main component for the AI-based recipe generator UI.
 */
const Home: React.FC = () => {
  const { state, dispatch } = useRecipe(); // Use the global store
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (type: string, value: string) => {
    dispatch({ type: type as any, payload: value });
  };

  const handleGenerate = async () => {
    if (!state.ingredients) {
      alert("Please enter at least one ingredient");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ingredients = state.ingredients.split(",").map((i) => i.trim());
      console.log("Sending ingredients:", ingredients);

      const response = await axios.post(
        "http://localhost:3000/recipe",
        {
          ingredients: ingredients,
          allergies: state.allergies,
          cuisine: state.cuisine,
          timeLimit: state.timeLimit,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.recipe && response.data.recipe.parts) {
        const recipeText = response.data.recipe.parts[0].text;
        console.log("Recipe Text:", recipeText);

        const lines = recipeText.split("\n").filter((line) => line.trim());
        console.log("Parsed Lines:", lines);

        // Parse the markdown formatted response
        const recipe = {
          name: lines[0].replace("##", "").trim(),
          description: lines[1] || "",
          ingredients: lines
            .filter((line) => line.startsWith("*"))
            .map((line) => line.replace("*", "").trim()),
          instructions: lines
            .filter((line) => /^\d+\./.test(line))
            .map((line) => line.replace(/^\d+\./, "").trim()),
        };

        console.log("Parsed Recipe:", recipe);
        dispatch({ type: "SET_GENERATED_RECIPE", payload: recipe });
        navigate("/AlgoEAThm/Instruction");
      } else {
        setError("No recipe was generated. Please try again.");
      }
    } catch (error: any) {
      console.error("Error details:", error);
      let errorMessage = "Failed to generate recipe. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = () => {
    alert("Login/Register logic goes here!");
  };

  return (
    <div className="algoEAThm-container">
      {/* Top Bar */}
      <header className="algoEAThm-topbar">
        <div className="algoEAThm-leftSection">
          <img src="5500.png" alt="AlgoEAThm Logo" className="algoEAThm-logo" />
          <h2 className="algoEAThm-title">AlgoEAThm</h2>
        </div>
        <div className="algoEAThm-rightSection">
          <button onClick={handleAuth} className="algoEAThm-AuthBtn">
            Login/Register
          </button>
        </div>
      </header>

      {/* Main Form Section */}
      <main className="algoEAThm-main">
        <nav className="algoEAThm-tabs">
          {/* Use NavLink so we can style the active tab */}
          <NavLink
            to="/AlgoEAThm"
            className={({ isActive }) =>
              isActive ? "algoEAThm-tab algoEAThm-tab-active" : "algoEAThm-tab"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/AlgoEAThm/Instruction"
            className={({ isActive }) =>
              isActive ? "algoEAThm-tab algoEAThm-tab-active" : "algoEAThm-tab"
            }
          >
            Instruction
          </NavLink>
        </nav>
        <div className="mt-3">
          <h3>Generate a Recipe</h3>
        </div>
        <label htmlFor="ingredients" className="algoEAThm-label">
          Ingredients (comma-separated, max 10):
        </label>
        <input
          id="ingredients"
          type="text"
          placeholder="e.g., tomatoes, pasta, cheese"
          value={state.ingredients}
          onChange={(e) => handleInputChange("SET_INGREDIENTS", e.target.value)}
          className="algoEAThm-input"
        />
        <label htmlFor="allergies" className="algoEAThm-label">
          Allergies (optional):
        </label>
        <input
          id="allergies"
          type="text"
          placeholder="e.g., peanuts"
          value={state.allergies}
          onChange={(e) => handleInputChange("SET_ALLERGIES", e.target.value)}
          className="algoEAThm-input"
        />

        <label htmlFor="cuisine" className="algoEAThm-label">
          Cuisine (optional):
        </label>
        <input
          id="cuisine"
          type="text"
          placeholder="e.g., Italian"
          value={state.cuisine}
          onChange={(e) => handleInputChange("SET_CUISINE", e.target.value)}
          className="algoEAThm-input"
        />

        <label htmlFor="timeLimit" className="algoEAThm-label">
          Time Limit In Minute (optional):
        </label>
        <input
          id="timeLimit"
          type="text"
          placeholder="e.g., 30"
          value={state.timeLimit}
          onChange={(e) => handleInputChange("SET_TIME_LIMIT", e.target.value)}
          className="algoEAThm-input"
        />

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleGenerate}
          className="algoEAThm-generateBtn"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </main>
    </div>
  );
};

export default Home;
