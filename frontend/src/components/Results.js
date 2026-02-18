import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/Results.css";

const constituencies = [
  "Ahmedabad East",
  "Surat West",
  "Vadodara Central",
];

function Results() {
  const navigate = useNavigate();
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [results, setResults] = useState([]);

  // 🔐 Admin protection
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      alert("Access denied. Admin only.");
      navigate("/vote");
    }
  }, []);

  useEffect(() => {
    if (selectedConstituency) {
      fetchResults();
    }
  }, [selectedConstituency]);

  const fetchResults = async () => {
    try {
      const role = localStorage.getItem("role");

      const res = await api.get(
        `/results?constituency=${selectedConstituency}&role=${role}`
      );

      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results", error);
    }
  };

  return (
    <div className="results-page">
      <h2>Election Results</h2>

      <select
        className="constituency-select"
        value={selectedConstituency}
        onChange={(e) => setSelectedConstituency(e.target.value)}
      >
        <option value="">Select Constituency</option>
        {constituencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {results.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#138808" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="info-text">
          Please select a constituency to view results.
        </p>
      )}
    </div>
  );
}

export default Results;
