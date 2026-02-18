import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Vote from "./components/Vote";
import Results from "./components/Results";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/results" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Routes */}
        <Route
          path="/vote"
          element={
            <ProtectedRoute>
              <Vote />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Login from "./components/Login";
// import Register from "./components/Register";
// import Vote from "./components/Vote";
// import Result from "./components/Result";
// import AdminDashboard from "./components/AdminDashboard";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Navbar />

//       <Routes>
//         {/* Public Route */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Routes */}
//         <Route
//           path="/vote"
//           element={
//             <ProtectedRoute>
//               <Vote />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/result"
//           element={
//             <ProtectedRoute>
//               <Result />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;