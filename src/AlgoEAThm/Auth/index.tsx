import React from "react";
import AuthForm from "./AuthForm";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="form-section">
        <h1
            style={{ cursor: "pointer"}}
            onClick={() => navigate("/AlgoEAThm")}
        >
        AlgoEAThm
      </h1>
          <AuthForm />
        </div>
        <div className="logo-section">
          <img src="5500.png" alt="AlgoEAThm Logo" className="algoEAThm-x-logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;
