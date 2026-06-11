import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Blockchain.css";

function BlockchainExplorer() {

  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {

    try {

      const res = await api.get("/blockchain");

      setBlocks(res.data);

    } catch (error) {
      console.error("Error fetching blockchain", error);
    }
  };

  return (
    <div className="blockchain-page">

      <h2>Blockchain Explorer</h2>

      {blocks.map((block, index) => (

        <div className="block-card" key={index}>

          <h3>Block {index + 1}</h3>

          <p><strong>User:</strong> {block.username}</p>
          <p><strong>Candidate:</strong> {block.candidate}</p>
          <p><strong>Constituency:</strong> {block.constituency}</p>

          <p><strong>Previous Hash:</strong> {block.previousHash}</p>
          <p><strong>Hash:</strong> {block.hash}</p>

          <p><strong>Timestamp:</strong> {block.timestamp}</p>

        </div>

      ))}

    </div>
  );
}

export default BlockchainExplorer;