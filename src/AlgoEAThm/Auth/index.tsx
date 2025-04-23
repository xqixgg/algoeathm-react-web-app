import React from "react";
import AuthForm from "./AuthForm";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();

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
        <div className="logo-section">
          <img src="5500.png" alt="AlgoEAThm Logo" className="algoEAThm-x-logo" />
        </div>
        <div className="form-section">
          <h1
            style={{ cursor: "pointer"}}
            onClick={() => navigate("/AlgoEAThm")}
          >
            AlgoEAThm
          </h1>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
