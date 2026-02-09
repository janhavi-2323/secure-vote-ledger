import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/register", {
        username,
        password,
        role: "VOTER",
      });

      setMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMsg("Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = async (cred) => {
    try {
      await api.post("/google-register", {
        token: cred.credential,
      });

      setMsg("Google registration successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMsg("Google registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Secure Vote Ledger</h2>
        <p className="subtitle">Voter Registration Portal</p>

        <form onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
          {msg && <p className="error-text">{msg}</p>}
        </form>

        <p className="subtitle">— OR —</p>

        <GoogleLogin
          onSuccess={handleGoogleRegister}
          onError={() => setMsg("Google registration failed")}
        />

        <p>
          Already registered? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
