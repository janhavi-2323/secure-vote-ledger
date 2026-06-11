import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [validationResult, setValidationResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [turnout, setTurnout] = useState(0);

  const partyColors = {
    "Party Alpha": "#2e7d32",
    "Party Beta": "#1565c0",
    "Party Gamma": "#ef6c00"
  };

  useEffect(() => {
    fetchStats();
    fetchTurnout();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const role = localStorage.getItem("role");

      const res = await api.get(`/admin/stats?role=${role}`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };
  const fetchTurnout = async () => {
    try {

      const role = localStorage.getItem("role");

      const res = await api.get(`/admin/turnout?role=${role}`);

      setTurnout(res.data.turnout);

    } catch (error) {

      console.error("Error fetching turnout", error);

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
  const openElection = async () => {
    try {
      const role = localStorage.getItem("role");

      await api.post(`/admin/open-election?role=${role}`);

      alert("Election opened successfully");

    } catch (error) {
      console.error("Error opening election", error);
    }
  };

  const closeElection = async () => {
    try {
      const role = localStorage.getItem("role");

      await api.post(`/admin/close-election?role=${role}`);

      alert("Election closed successfully");

    } catch (error) {
      console.error("Error closing election", error);
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Admin Dashboard</h2>

      {stats && (
        <>
            <div className="stats-grid">
              <div className="stat-card highlight">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
              </div>

              <div className="stat-card highlight">
                  <h3>Total Votes</h3>
                  <p>{stats.totalVotes}</p>
              </div>
              <div className="stat-card highlight">
                  <h3>Leading Candidate</h3>
                  <p>{stats.leadingCandidate}</p>
              </div>
              {turnout &&(
                <div className="stat-card highlight">
                    <h3>Voter Turnout</h3>
                    <p>{turnout.toFixed(2)}%</p>
                </div>
              )}
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
                    data={Object.entries(stats.partyVotes || {}).map(([party, votes]) => ({
                      party,
                      votes
                    }))}
                    dataKey="votes"
                    nameKey="party"
                    outerRadius={100}
                  >
                    {Object.entries(stats.partyVotes || {}).map(([party], index) => (
                      <Cell
                        key={index}
                        fill={partyColors[party] || "#8884d8"}
                      />
                    ))}
                  </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            </div>
            <div className="validation-section">
              <button className="validate-btn" onClick={openElection}>
                🟢 Open Election
              </button>
              <button className="validate-btn" onClick={closeElection}>
                🔴 Close Election
              </button>
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