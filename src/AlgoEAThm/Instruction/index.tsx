import { NavLink, useNavigate } from "react-router-dom";
import "./index.css";
import { useRecipe } from "../store/RecipeContext"; // Import global state
import React, { useState } from "react";
import Header from "../Header";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function Instruction() {
  const { state } = useRecipe();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleAuth = () => {
    navigate("/AlgoEAThm/login");
  };

  const capitalizeFirst = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        // User is not logged in, redirect to login
        navigate("/AlgoEAThm/login");
        return;
      }

      if (!state.generatedRecipe) {
        setSaveError("No recipe to save");
        setIsSaving(false);
        return;
      }

      // Create recipe JSON data
      const recipeData = {
        userId: currentUser.uid,
        name: state.generatedRecipe.name,
        description: state.generatedRecipe.description,
        ingredients: state.generatedRecipe.ingredients,
        instructions: state.generatedRecipe.instructions,
        allergies: state.allergies,
        cuisine: state.cuisine,
        timeLimit: state.timeLimit,
        createdAt: serverTimestamp(),
      };

      // Save recipe to userRecipes collection with generated ID
      await addDoc(collection(db, "userRecipes"), recipeData);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error saving recipe:", err);
      setSaveError("Failed to save recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="algoEAThm-container">
      {/* Top Bar */}
      <Header />

      {/* Main Form Section */}
      <div className="ins-container">
        <nav className="algoEAThm-tabs">
          {/* Use NavLink so we can style the active tab */}
          <NavLink
            to="/AlgoEAThm"
            end
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
          <NavLink
            to="/AlgoEAThm/saved-recipes"
            className={({ isActive }) =>
              isActive ? "algoEAThm-tab algoEAThm-tab-active" : "algoEAThm-tab"
            }
          >
            Saved Recipes
          </NavLink>
        </nav>
        <div className="ins-topbar">
          <h3>{state.generatedRecipe?.name || "Name of the recipe"}</h3>
        </div>
        <div className="ins-description-box">
          <p className="ins-title">Description</p>
          <p>
            {state.generatedRecipe?.description || "No description available"}
          </p>
        </div>
        <div className="ins-row">
          <div className="ins-ingredients">
            <p>Ingredients list</p>
            <ul>
              {state.generatedRecipe?.ingredients?.length ? (
                state.generatedRecipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No ingredients provided</li>
              )}
            </ul>
            <div className="mt-5">
              <p className="ins-info">
                <strong>Allergies:</strong>{" "}
                {capitalizeFirst(state.allergies) || "None"}
              </p>
              <p className="ins-info">
                <strong>Cuisine:</strong>{" "}
                {capitalizeFirst(state.cuisine) || "Not specified"}
              </p>
              <p className="ins-info">
                <strong>Time Limit:</strong>{" "}
                {state.timeLimit ? `${state.timeLimit} minutes` : "N/A"}
              </p>
            </div>
          </div>
          <div className="ins-steps">
            <p>Instructions</p>
            <ul>
              {state.generatedRecipe?.instructions?.length ? (
                state.generatedRecipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : (
                <li>No instructions available</li>
              )}
            </ul>
          </div>
        </div>
        <div className="ins-row align-items-center justify-content-center">
          <button
            onClick={handleSave}
            className={`algoEAThm-generateBtn ${isSaving ? "disabled" : ""}`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save to My Recipes"}
          </button>

          {saveSuccess && (
            <div className="save-success-message">
              Recipe saved successfully!{" "}
              <NavLink to="/AlgoEAThm/saved-recipes">
                View saved recipes
              </NavLink>
            </div>
          )}

          {saveError && <div className="save-error-message">{saveError}</div>}
        </div>
      </div>
    </div>
  );
}
