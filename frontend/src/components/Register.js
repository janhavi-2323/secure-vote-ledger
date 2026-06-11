import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [voterId, setVoterId] = useState("");
  const [constituency, setConstituency] = useState("");
  const [constituencies, setConstituencies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    try {
      const res = await api.get("/constituencies");
      setConstituencies(res.data);
    } catch (error) {
      console.error("Error loading constituencies", error);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await api.post("/register", {
        username,
        password,
        voterId,
        constituency,
        role: "VOTER",
      });

      setMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMsg("Registration failed. Please try again.");
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
          <input
            type="text"
            placeholder="Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            required
          />
          <select
            value={constituency}
            onChange={(e) => setConstituency(e.target.value)}
            required
          >
            <option value="">Select Constituency</option>

            {constituencies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}

          </select>
          <button type="submit">Register</button>
          {msg && <p className="error-text">{msg}</p>}
        </form>

        <p>
          Already registered? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;