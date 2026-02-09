import React, { useState } from "react";
import "../styles/Results.css";

const constituencies = [
  "Ahmedabad East",
  "Surat West",
  "Vadodara Central",
];

const resultsData = {
  "Ahmedabad East": [
    { name: "Candidate A", votes: 120 },
    { name: "Candidate B", votes: 95 },
    { name: "Candidate C", votes: 60 },
  ],
  "Surat West": [
    { name: "Candidate D", votes: 110 },
    { name: "Candidate E", votes: 85 },
    { name: "Candidate F", votes: 70 },
  ],
  "Vadodara Central": [
    { name: "Candidate G", votes: 130 },
    { name: "Candidate H", votes: 90 },
    { name: "Candidate I", votes: 55 },
  ],
};

function Results() {
  const [selectedConstituency, setSelectedConstituency] = useState("");

  const results = selectedConstituency
    ? resultsData[selectedConstituency]
    : [];

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  return (
    <div className="results-page">
      <h2>Election Results</h2>

      {/* Constituency Selector */}
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

      {/* Results */}
      {results.length > 0 ? (
        results.map((r) => (
          <div key={r.name} className="result-row">
            <span className="candidate-name">{r.name}</span>

            <div className="bar-container">
              <div
                className="bar"
                style={{
                  width: `${(r.votes / totalVotes) * 100}%`,
                }}
              ></div>
            </div>

            <span className="vote-count">{r.votes} votes</span>
          </div>
        ))
      ) : (
        <p className="info-text">
          Please select a constituency to view results.
        </p>
      )}
    </div>
  );
}

export default Results;
