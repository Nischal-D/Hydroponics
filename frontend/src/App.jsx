import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppNavbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import PlantSetup from "./pages/PlantSetup";
import Login from "./components/Login";
import { logout } from "./api/axios";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <>
      <AppNavbar
        onLogout={() => {
          logout();
          setIsLoggedIn(false);
        }}
      />

      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plant-setup" element={<PlantSetup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
