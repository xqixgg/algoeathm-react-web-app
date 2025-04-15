import { NavLink, useNavigate } from "react-router-dom";
import "./index.css";
import { useRecipe } from "../store/RecipeContext"; // Import global state
import React, { useState } from "react";
import Header from "../Header";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useEffect } from "react";
import { getDocs, query, where } from "firebase/firestore";
import axios from "axios";

export default function Instruction() {
  const { state, dispatch } = useRecipe();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  useEffect(() => {
    const checkIfRecipeIsSaved = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser || !state.generatedRecipe) return;
  
      const userRecipesRef = collection(db, "userRecipes");
      const q = query(
        userRecipesRef,
        where("userId", "==", currentUser.uid),
        where("name", "==", state.generatedRecipe.name) // or match a hash/ID if you have one
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsAlreadySaved(true);
      }
    };
  
    checkIfRecipeIsSaved();
  }, [state.generatedRecipe]);

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
        alert("Please log in to save recipes");
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
      setIsAlreadySaved(true);
      // setTimeout(() => {
      //   setSaveSuccess(false);
      // }, 3000);
    } catch (err) {
      console.error("Error saving recipe:", err);
      setSaveError("Failed to save recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleRefresh = async () => {
    const ingredients = state.ingredients?.split(",").map(i => i.trim());
    if (!ingredients || ingredients.length === 0) {
      alert("No ingredients to refresh with.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:3000/recipe", {
        ingredients
      });
  
      dispatch({ type: "SET_GENERATED_RECIPE", payload: res.data.recipe });
    } catch (err) {
      alert("Failed to refresh recipe.");
      console.error(err);
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
          className={`algoEAThm-generateBtn ${isSaving || isAlreadySaved ? "disabled" : ""}`}
          disabled={isSaving || isAlreadySaved}
        >
          {isSaving
            ? "Saving..."
            : isAlreadySaved
            ? "Saved to Recipes"
            : "Save to My Recipes"}
        </button>

        <button
    onClick={handleRefresh}
    style={{
      marginTop: "1rem",
      padding: "10px 20px",
      borderRadius: "8px",
      backgroundColor: "#f0f0f0",
      border: "none",
      cursor: "pointer"
    }}
  >
    🔄 Refresh Recipe
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
