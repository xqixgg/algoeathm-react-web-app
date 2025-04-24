import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import "./index.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const oobCode = searchParams.get("oobCode");
      if (!oobCode) {
        setError("Invalid reset link");
        return;
      }

      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/AlgoEAThm/login");
      }, 3000);
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
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <label>NEW PASSWORD</label>
            <br />
            <input
              type="password"
              className="min-w-400"
              placeholder="Type here..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <br />
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
            <button className="algoEAThm-generateBtn mb-3 min-w-400" type="submit">
              Reset Password
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">
              Password has been reset successfully. Redirecting to login...
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 