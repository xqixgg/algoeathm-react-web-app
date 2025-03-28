import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import Header from "../Header";
import "./index.css";

// Define the recipe interface to match the JSON structure
interface SavedRecipe {
  id: string;
  userId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  allergies: string;
  cuisine: string;
  timeLimit: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(
    null
  );

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError("You must be logged in to view saved recipes");
          setLoading(false);
          return;
        }

        // Query recipes where userId matches current user's ID
        const userRecipesRef = collection(db, "userRecipes");
        const q = query(userRecipesRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const recipes: SavedRecipe[] = [];
        querySnapshot.forEach((doc) => {
          // Parse each document into a SavedRecipe object
          const data = doc.data();
          recipes.push({
            id: doc.id,
            userId: data.userId,
            name: data.name || "Unnamed Recipe",
            description: data.description || "",
            ingredients: Array.isArray(data.ingredients)
              ? data.ingredients
              : [],
            instructions: Array.isArray(data.instructions)
              ? data.instructions
              : [],
            allergies: data.allergies || "",
            cuisine: data.cuisine || "",
            timeLimit: data.timeLimit || "",
            createdAt: data.createdAt || {
              seconds: Date.now() / 1000,
              nanoseconds: 0,
            },
          });
        });

        // Sort by newest first
        recipes.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        setSavedRecipes(recipes);
        setLoading(false);

        // Auto-select the first recipe if available
        if (recipes.length > 0) {
          setSelectedRecipe(recipes[0]);
        }
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
        setError("Failed to load saved recipes");
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this recipe?")) {
        return;
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, "userRecipes", recipeId));

      // Update local state
      const updatedRecipes = savedRecipes.filter(
        (recipe) => recipe.id !== recipeId
      );
      setSavedRecipes(updatedRecipes);

      // Update selected recipe if needed
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe(updatedRecipes.length > 0 ? updatedRecipes[0] : null);
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert("Failed to delete recipe");
    }
  };

  const capitalizeFirst = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="algoEAThm-container">
      <Header />

      <div className="saved-recipes-container">
        <nav className="algoEAThm-tabs">
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

        <h2 className="saved-recipes-title">My Saved Recipes</h2>

        {loading ? (
          <div className="loading-container">Loading saved recipes...</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : savedRecipes.length === 0 ? (
          <div className="no-recipes-container">
            <p>You haven't saved any recipes yet.</p>
            <NavLink to="/AlgoEAThm" className="algoEAThm-generateBtn">
              Create a Recipe
            </NavLink>
          </div>
        ) : (
          <div className="saved-recipes-layout">
            <div className="recipes-list">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={`recipe-card ${
                    selectedRecipe?.id === recipe.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <h3>{recipe.name}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  <div className="recipe-meta">
                    {recipe.cuisine && (
                      <span>Cuisine: {capitalizeFirst(recipe.cuisine)}</span>
                    )}
                    {recipe.timeLimit && (
                      <span>Time: {recipe.timeLimit} min</span>
                    )}
                  </div>
                  <button
                    className="delete-recipe-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecipe(recipe.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {selectedRecipe && (
              <div className="recipe-details">
                <h2>{selectedRecipe.name}</h2>
                <p className="recipe-full-description">
                  {selectedRecipe.description}
                </p>

                <div className="recipe-info-grid">
                  <div className="recipe-ingredients">
                    <h3>Ingredients</h3>
                    <ul>
                      {selectedRecipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>

                    <div className="recipe-meta-details">
                      <p>
                        <strong>Allergies:</strong>{" "}
                        {capitalizeFirst(selectedRecipe.allergies) || "None"}
                      </p>
                      <p>
                        <strong>Cuisine:</strong>{" "}
                        {capitalizeFirst(selectedRecipe.cuisine) ||
                          "Not specified"}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {selectedRecipe.timeLimit
                          ? `${selectedRecipe.timeLimit} minutes`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="recipe-instructions">
                    <h3>Instructions</h3>
                    <ol>
                      {selectedRecipe.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
