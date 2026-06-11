import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Vote from "./components/Vote";
import Results from "./components/Results";
import Dashboard from "./components/Dashboard";
import BlockchainExplorer from "./components/BlockchainExplorer";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

function AppContent() {

  const role = localStorage.getItem("role");
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];

  const showNavbar =
    role === "ADMIN" && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/vote"
          element={
            <ProtectedRoute>
              <Vote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/results"
          element={
            <AdminRoute>
              <Results />
            </AdminRoute>
          }
        />

        <Route
          path="/blockchain"
          element={
            <AdminRoute>
              <BlockchainExplorer />
            </AdminRoute>
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;