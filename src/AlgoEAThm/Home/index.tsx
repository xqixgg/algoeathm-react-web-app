import "./index.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecipe } from "../store/RecipeContext"; // Import global store
import axios from "axios";
import { useState } from "react";
import Header from "../Header";

const Home: React.FC = () => {
  const { state, dispatch } = useRecipe(); // Use the global store
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [currentUser, setCurrentUser] = useState(null);
  // const [username, setUsername] = useState("");
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
      const ingredients = state.ingredients.split(',').map(i => i.trim());
      const cuisine = state.cuisine?.trim() || "";
      const allergies = state.allergies?.trim() || "";
      const timeLimit = state.timeLimit?.trim() || "";
      
      console.log("Sending API request with:", {
        ingredients,
        cuisine,
        allergies,
        timeLimit
      });
      
      const response = await axios.post(
        "http://localhost:3000/recipe",
        { ingredients, cuisine, allergies, timeLimit },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );


      console.log('API Response:', response.data);

      if (response.data.recipe) {
        const {
          name = "",
          description = "",
          ingredients: apiIngredients,
          instructions: apiInstructions,
        } = response.data.recipe;

        const parsedRecipe = {
          name: name?.trim() || "Unnamed Dish",
          description: description?.trim() || "No description provided.",
          ingredients: Array.isArray(apiIngredients) && apiIngredients.length > 0
            ? apiIngredients.map(ing => ing.trim())
            : ["No ingredients provided."],
          instructions: Array.isArray(apiInstructions) && apiInstructions.length > 0
            ? apiInstructions.map(step => step.trim())
            : ["No instructions provided."],
        };

        console.log('Parsed Recipe:', parsedRecipe);
        dispatch({ type: 'SET_GENERATED_RECIPE', payload: parsedRecipe });
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

  // const handleAuth = () => {
  //   navigate("/AlgoEAThm/login");
  // };
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setCurrentUser(user);
  //       const docRef = doc(db, "users", user.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setUsername(docSnap.data().username || user.email);
  //       }
  //     } else {
  //       setCurrentUser(null);
  //       setUsername("");
  //     }
  //   });
  
  //   return () => unsubscribe();
  // }, []);
  return (
    <div className="algoEAThm-container">
      {/* Top Bar */}
      <Header />

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
