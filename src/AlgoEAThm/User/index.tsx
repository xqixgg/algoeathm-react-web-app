import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { 
  getFirestore, 
  doc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import Header from "../Header";
import "./index.css";

const UserProfile = () => {
  const { currentUser, username } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const db = getFirestore();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsDeleting(true);

    try {
      if (!currentUser || !currentUser.email) {
        throw new Error("No user logged in");
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid));

      // Delete user's saved recipes
      const userRecipesRef = collection(db, "userRecipes");
      const q = query(userRecipesRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete the user account
      await currentUser.delete();
      
      // Navigate to home page
      navigate("/AlgoEAThm");
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error instanceof Error) {
        if (error.message.includes("auth/wrong-password")) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Failed to delete account. Please try again.");
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="algoEAThm-container">
        <Header />
        

        <div className="user-profile-container">
          <h2>Please log in to view your profile</h2>
          
          <NavLink to="/AlgoEAThm/login" className="algoEAThm-generateBtn">
            Login
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="algoEAThm-container">
      <Header />
      <div className="profile-wrapper">
        <div className="profile-img-wrapper">
        <img
            src="/profile.png"
            alt="Profile Banner"
            className="profile-img"
        />
        </div>
      
      <div className="user-profile-container">
      <div className="user-profile-card">
          <h2>User Profile <i className="fas fa-user custome-icon"></i></h2>
          <div className="profile-info">
            <div className="info-item">
              <label>Username:</label>
              <span>{username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{currentUser.email}</span>
            </div>
          </div>

          <div className="profile-actions">
            <NavLink to="/AlgoEAThm/saved-recipes" className="profile-link">
              View Saved Recipes
            </NavLink>
            <NavLink to="/AlgoEAThm/forgot-password" className="profile-link">
              Reset Password
            </NavLink>
            <button
              className="delete-account-btn"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
            <button onClick={() => navigate("/AlgoEAThm")} className="delete-account-btn">
              Back to Home
            </button>
          </div>

          {showPasswordPrompt && (
            <div className="password-prompt">
              <form onSubmit={handlePasswordSubmit}>
                <h3>Confirm Your Password</h3>
                <p>Please enter your password to delete your account:</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                {error && <p className="error-message">{error}</p>}
                <div className="password-prompt-actions">
                  <button type="submit" className="delete-account-btn" disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    type="button"
                    className="delete-account-btn-cancel"
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPassword("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default UserProfile; 