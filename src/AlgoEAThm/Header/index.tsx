import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || user.email);
        }
      } else {
        setCurrentUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = () => {
    navigate("/AlgoEAThm/login");
  };

  const handleMyRecipes = () => {
    alert("My Recipes logic goes here!");
  }

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signOut(auth);
      setCurrentUser(null);
      setUsername("");
      navigate("/AlgoEAThm/login");
    }
  };

  return (
    <header className="algoEAThm-topbar">
      <div className="algoEAThm-leftSection">
        <img src="/5500.png" alt="AlgoEAThm Logo" className="algoEAThm-logo" />
        <h2 className="algoEAThm-title">AlgoEAThm</h2>
      </div>
      <div className="algoEAThm-rightSection">
        {currentUser ? (
          <>
            <span className="welcome-text">Welcome, {username}!</span>
            <button className="algoEAThm-AuthBtn" onClick={handleMyRecipes}>My Recipes</button>
            <button className="algoEAThm-AuthBtn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={handleAuth} className="algoEAThm-AuthBtn">
            Login/Register
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
