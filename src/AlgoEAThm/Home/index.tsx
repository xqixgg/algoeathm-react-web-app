import "./index.css";
import { NavLink, useNavigate } from "react-router-dom"; 
import { useRecipe } from "../store/RecipeContext"; // Import global store

/**
 * Main component for the AI-based recipe generator UI.
 */
const Home: React.FC = () => {
  const { state, dispatch } = useRecipe(); // Use the global store
  const navigate = useNavigate();

  
  const handleInputChange = (type: string, value: string) => {
    dispatch({ type: type as any, payload: value });
  };

  const handleGenerate = () => {    
    alert("Generate Recipe logic goes here!");
    navigate("/AlgoEAThm/Instruction");
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

        <button onClick={handleGenerate} className="algoEAThm-generateBtn">
          Generate
        </button>
      </main>
    </div>
  );
};

export default Home;
