import React, { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";


/**
 * Main component for the AI-based recipe generator UI.
 */
const Home: React.FC = () => {
  // State for each input
  const [ingredients, setIngredients] = useState("");
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  /**
   * Handle the "Generate" button click
   */
  const handleGenerate = () => {
    // Split the ingredients by commas
    const ingredientList = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    // Limit check: no more than 10 ingredients
    if (ingredientList.length > 10) {
      alert("You can only enter up to 10 ingredients.");
      return;
    }

    // Here, connect to your AI or recipe generation logic:
    console.log("Ingredients:", ingredientList);
    console.log("Allergies:", allergies || "None");
    console.log("Cuisine:", cuisine || "None");
    console.log("Time Limit:", timeLimit || "None");

    alert("Recipe generation logic goes here!");
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
      
      {/* Nav back to instruction page delete later */}
      <Link to="/AlgoEAThm/Instruction">Instruction</Link>

      {/* Main Form Section */}
      <main className="algoEAThm-main">
        <h3>Generate a Recipe</h3>

        <label htmlFor="ingredients" className="algoEAThm-label">
          Ingredients (comma-separated, max 10):
        </label>
        <input
          id="ingredients"
          type="text"
          placeholder="e.g., tomatoes, pasta, cheese"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="algoEAThm-input"
        />

        <label htmlFor="allergies" className="algoEAThm-label">
          Allergies (optional):
        </label>
        <input
          id="allergies"
          type="text"
          placeholder="e.g., peanuts"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="algoEAThm-input"
        />

        <label htmlFor="cuisine" className="algoEAThm-label">
          Cuisine (optional):
        </label>
        <input
          id="cuisine"
          type="text"
          placeholder="e.g., Italian"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="algoEAThm-input"
        />

        <label htmlFor="timeLimit" className="algoEAThm-label">
          Time Limit In Minute (optional):
        </label>
        <input
          id="timeLimit"
          type="text"
          placeholder="e.g., 30"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="algoEAThm-input"
        />

        <button onClick={handleGenerate} className="algoEAThm-generateBtn">
          Generate
        </button>
      </main>
    </div>
  );
};

export default Home;
