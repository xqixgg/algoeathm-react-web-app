import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        navigate("/Instruction");
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
          email,
          username,
          savedRecipes: [],
          createdAt: serverTimestamp(),
        });
      }
      navigate("/AlgoEAThm", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  const handleContinueWithoutLogin = () => {
    navigate("/AlgoEAThm");
  };

  return (
    <div>
      <h2 className="pb-3">{isLogin ? "Log in" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <label>EMAIL</label>
        <br />
        <input
          type="email"
          className="min-w-400"
          placeholder="Type here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        {!isLogin && (
          <>
            <label className="pt-3">USERNAME</label>
            <br />
            <input
              type="text"
              className="min-w-400"
              placeholder="Type here..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
          </>
        )}
        <label className="pt-3">PASSWORD</label>
        <br />
        <input
          type="password"
          className="min-w-400"
          placeholder="Type here..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        {!isLogin && (
          <>
            <label className="pt-3">CONFIRM PASSWORD</label>
            <br />
            <input
              type="password"
              className="min-w-400"
              placeholder="Type here..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <br />
          </>
        )}

        <button className="algoEAThm-generateBtn mb-3 min-w-400" type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="auth-options">
        <div className="toggle-option">
          {isLogin
            ? "------------ NEW TO ALGOEATHM? -----------"
            : "--------- ALREADY WITH ALGOEATHM? --------"}{" "}
          <button
            className="algoEAThm-generateBtn mb-3 min-w-400"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
        <div className="continue-option">
          <p>-------- OR CONTINUE WITHOUT LOGIN --------</p>
          <button
            className="algoEAThm-generateBtn mb-3 min-w-400 continue-without-login"
            onClick={handleContinueWithoutLogin}
          >
            Continue Without Login
          </button>
        </div>
      </div>
    </div>
  );
}
