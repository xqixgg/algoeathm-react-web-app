import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        setUser(res.user);
        navigate("/Instruction");
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
          email,
          username,
          savedRecipes: [],
          createdAt: serverTimestamp(),
        });
        setUser(res.user);
      }
      navigate("/AlgoEAThm", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
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
  );
}
