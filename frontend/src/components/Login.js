import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import "../styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      navigate("/vote");
      
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleGoogleLogin = async (cred) => {
    try {
      const res = await api.post("/google-login", {
        token: cred.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      navigate("/vote");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Secure Vote Ledger</h2>
        <p className="subtitle">Blockchain-Based E-Voting System</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <p className="subtitle">— OR —</p>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Google login failed")}
        />

        <p>
          New voter? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
  
}

export default Login;
