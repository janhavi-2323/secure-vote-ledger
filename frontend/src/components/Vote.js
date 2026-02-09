import React, { useState } from "react";
import "../styles/Vote.css";
import api from "../services/api";   

const constituencies = [
  "Ahmedabad East",
  "Surat West",
  "Vadodara Central",
];

const candidates = [
  {
    id: 1,
    name: "Candidate A",
    party: "Party Alpha",
    symbol: "🟢",
    color: "#2e7d32",
    constituency: "Ahmedabad East",
  },
  {
    id: 2,
    name: "Candidate B",
    party: "Party Beta",
    symbol: "🔵",
    color: "#1565c0",
    constituency: "Ahmedabad East",
  },
  {
    id: 3,
    name: "Candidate C",
    party: "Party Gamma",
    symbol: "🟠",
    color: "#ef6c00",
    constituency: "Ahmedabad East",
  },
  // Surat West
  {
    id: 4,
    name: "Candidate D",
    party: "Party Alpha",
    symbol: "🟢",
    color: "#2e7d32",
    constituency: "Surat West",
  },
  {
    id: 5,
    name: "Candidate E",
    party: "Party Beta",
    symbol: "🔵",
    color: "#1565c0",
    constituency: "Surat West",
  },
  {
    id: 6,
    name: "Candidate F",
    party: "Party Gamma",
    symbol: "🟠",
    color: "#ef6c00",
    constituency: "Surat West",
  },

  // Vadodara Central
  {
    id: 7,
    name: "Candidate G",
    party: "Party Alpha",
    symbol: "🟢",
    color: "#2e7d32",
    constituency: "Vadodara Central",
  },
  {
    id: 8,
    name: "Candidate H",
    party: "Party Beta",
    symbol: "🔵",
    color: "#1565c0",
    constituency: "Vadodara Central",
  },
  {
    id: 9,
    name: "Candidate I",
    party: "Party Gamma",
    symbol: "🟠",
    color: "#ef6c00",
    constituency: "Vadodara Central",
  },
];


function Vote() {
  const [error, setError] = useState("");
  const [constituency, setConstituency] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const filteredCandidates = candidates.filter(
    (c) => c.constituency === constituency
  );

  const selectedCandidate = candidates.find(
    (c) => c.id === selectedId
  );

  const handleVoteClick = () => {
    if (!selectedId || !constituency) return;
    setShowConfirm(true);
  };

  const confirmVote = async () => {
    setShowConfirm(false);
    setError("");

    try {
      await api.post("/vote", {
        username: localStorage.getItem("username"),
        constituency: constituency,
        candidate: selectedCandidate.name,
      });

      // Only show receipt if backend ACCEPTS vote
      setReceipt(selectedCandidate);

    }
    catch (err) {
        if (err.response && err.response.status === 403) {
            setError("❌ You have already voted. Multiple voting is not allowed.");
        } else {
            setError("❌ Voting failed. Please try again.");
        }
      }
  };


  return (
    <div className="vote-page">
      <header className="vote-header">
        <h1>Secure Vote Ledger</h1>
        <p>Electronic Voting Machine</p>
      </header>

      {/* Constituency Selection */}
      <select
        className="constituency-select"
        value={constituency}
        onChange={(e) => {
          setConstituency(e.target.value);
          setSelectedId(null);
          setReceipt(null);
        }}
      >
        <option value="">Select Constituency</option>
        {constituencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Candidate Cards */}
      <div className="candidate-grid">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`candidate-card ${
              selectedId === candidate.id ? "selected" : ""
            }`}
            style={{ borderColor: candidate.color }}
            onClick={() => setSelectedId(candidate.id)}
          >
            <div className="party-symbol">{candidate.symbol}</div>
            <h3>{candidate.name}</h3>
            <p>{candidate.party}</p>
          </div>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      {/* Vote Button */}
      <button
        className="vote-btn"
        disabled={!selectedId || !constituency}
        onClick={handleVoteClick}
      >
        Cast Vote
      </button>

      {/* Confirmation Modal */}
      {showConfirm && selectedCandidate && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Your Vote</h3>
            <p>
              You are voting for{" "}
              <strong>{selectedCandidate.name}</strong>
            </p>

            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmVote}>
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Receipt */}
      {receipt && (
        <div className="vote-receipt">
          <h3>✅ Vote Recorded Successfully</h3>
          <p>Candidate: {receipt.name}</p>
          <p>Party: {receipt.party}</p>
          <p className="thank-you">Thank you for voting!</p>
        </div>
      )}
    </div>
  );
}

export default Vote;
