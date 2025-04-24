import { useNavigate, NavLink } from "react-router-dom";
import { auth } from "../../firebase/config";
import { useRecipe } from "../store/RecipeContext";
import { useAuth } from "../store/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { dispatch } = useRecipe();
  const { currentUser, username } = useAuth();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        // Clear all recipe-related state
        dispatch({ type: "SET_GENERATED_RECIPE", payload: null });
        dispatch({ type: "SET_INGREDIENTS", payload: "" });
        dispatch({ type: "SET_ALLERGIES", payload: "" });
        dispatch({ type: "SET_CUISINE", payload: "" });
        dispatch({ type: "SET_TIME_LIMIT", payload: "" });
        
        await auth.signOut();
        navigate("/AlgoEAThm");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  return (
    <div className="algoEAThm-topbar">
      <div className="algoEAThm-leftSection">
        <img src="/5500.png" alt="Logo" className="algoEAThm-logo" />
        <h1 className="algoEAThm-title">AlgoEAThm</h1>
      </div>
      <div className="algoEAThm-rightSection">
        {currentUser ? (
          <>
            <NavLink to="/AlgoEAThm/profile" className="welcome-text">
              Welcome, {username}!
            </NavLink>
            <button className="algoEAThm-AuthBtn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/AlgoEAThm/login")} className="algoEAThm-AuthBtn">
            Login/Register
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
