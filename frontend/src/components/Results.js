import React, { useEffect, useState } from "react";
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

function Results() {
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [results, setResults] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  useEffect(() => {
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    try {
      const res = await api.get("/constituencies");
      setConstituencies(res.data);
    } catch (error) {
      console.error("Error fetching constituencies", error);
    }
  };

  useEffect(() => {
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
    if (selectedConstituency) {
      fetchResults();
    }
  }, [selectedConstituency]);

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
          <option key={c.id} value={c.name}>
            {c.name}
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