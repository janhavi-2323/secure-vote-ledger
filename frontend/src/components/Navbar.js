import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar">
      <div className="logo">Secure Vote Ledger</div>

      <div className="nav-links">
        <Link to="/vote">Vote</Link>

        {role === "ADMIN" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/results">Results</Link>
            <Link to="/blockchain">Blockchain</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;