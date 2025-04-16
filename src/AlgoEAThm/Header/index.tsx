import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { useRecipe } from "../store/RecipeContext";
const Header = () => {
  const navigate = useNavigate();
  const { dispatch } = useRecipe();
  const [user, setUser] = React.useState<{ displayName: string; email: string | null } | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Get the username from email if displayName is not available
        const username = user.displayName || user.email?.split('@')[0] || 'User';
        setUser({
          displayName: username,
          email: user.email
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.displayName}!</span>
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
