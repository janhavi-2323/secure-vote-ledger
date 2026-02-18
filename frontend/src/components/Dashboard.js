import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Dashboard.css";
import {PieChart,Pie,Tooltip,Cell,ResponsiveContainer} from "recharts";


function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      alert("Access denied. Admin only.");
      navigate("/vote");
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const role = localStorage.getItem("role");

      const res = await api.get(`/admin/stats?role=${role}`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };
  const validateChain = async () => {
  try {
    const role = localStorage.getItem("role");

    const res = await api.get(`/admin/validate-chain?role=${role}`);

    setValidationResult(res.data);

  } catch (error) {
    setValidationResult("❌ Validation failed.");
  }
};


  return (
    <div className="dashboard-page">
      <h2>Admin Dashboard</h2>

      {stats && (
  <>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>{stats.totalUsers}</p>
      </div>

      <div className="stat-card">
        <h3>Total Votes</h3>
        <p>{stats.totalVotes}</p>
      </div>

      <div className="stat-card highlight">
        <h3>Leading Candidate</h3>
        <p>{stats.leadingCandidate}</p>
      </div>
    </div>

    {/* Votes per Constituency */}
    <div className="constituency-section">
      <h3>Votes per Constituency</h3>
      {Object.entries(stats.votesByConstituency).map(
        ([name, count]) => (
          <div key={name} className="const-row">
            <span>{name}</span>
            <strong>{count} votes</strong>
          </div>
        )
      )}
    </div>
    
    {/* Pie Chart */}
    <div className="chart-container">
      <h3>Overall Vote Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={Object.entries(stats.candidateVotes).map(
              ([name, votes]) => ({ name, value: votes })
            )}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {Object.entries(stats.candidateVotes).map(
              ([,], index) => (
                <Cell
                  key={index}
                  fill={
                    ["#138808", "#1a237e", "#ef6c00", "#9c27b0"][
                      index % 4
                    ]
                  }
                />
              )
            )}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="validation-section">
        <button className="validate-btn" onClick={validateChain}>
          🔍 Validate Blockchain Integrity
        </button>

        {validationResult && (
          <p
            className={`validation-result ${
              validationResult.includes("valid") ? "success" : "error"
            }`}
          >
            {validationResult}
          </p>
        )}
    </div>

  </>
)}

    </div>
  );
}

export default Dashboard;
