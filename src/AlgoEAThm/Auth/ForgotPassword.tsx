import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./index.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="video-section">
        <video 
          className="login-video"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="login-overlay"></div>
      <div className="login-content">
        <div className="form-section">
          <h2>Forgot Password</h2>
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
            <button className="algoEAThm-generateBtn mb-3 min-w-400" type="submit">
              Send Reset Link
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">
              Password reset link has been sent to your email.
            </p>
          )}
          <button
            className="algoEAThm-generateBtn mb-3 min-w-400"
            onClick={() => navigate("/AlgoEAThm/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
} 