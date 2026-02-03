import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppNavbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PlantSetup from "./pages/PlantSetup";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // 🔒 If not logged in → only Login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <AppNavbar onLogout={handleLogout} />

         <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "64px"
      }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plant-setup" element={<PlantSetup />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
