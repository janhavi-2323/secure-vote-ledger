import React, { useState,useEffect } from "react";
import "../styles/Vote.css";
import api from "../services/api";   

function Vote() {
  const [error, setError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [constituency, setConstituency] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [isElectionOpen, setIsElectionOpen] = useState(true);

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
    const fetchElectionStatus = async () => {
      try {
        const res = await api.get("/election-status");
        setIsElectionOpen(res.data);
      } catch (error) {
        console.error("Error fetching election status", error);
      }
    };
    fetchElectionStatus();
  }, []);
  useEffect(() => {
    if (constituency) {
      fetchCandidates();
    }
  }, [constituency]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get(`/candidates?constituency=${constituency}`);
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };
  const filteredCandidates = candidates;

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
      if (err.response && err.response.data) {
          setError(`❌ ${err.response.data}`);
      } 
      else {
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
          <option key={c.id} value={c.name}>
            {c.name}
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
      {!isElectionOpen && (
        <p className="error-message">
          ❌ Election is currently closed. Voting is not allowed.
        </p>
      )}
      <button
        className="vote-btn"
        disabled={!selectedId || !constituency || !isElectionOpen}
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