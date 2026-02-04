import React, { useState } from 'react';
import AppNavbar from "../src/components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { logout } from "./api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  // Check for existing access token on initial load
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout(); // Remove tokens
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <AppNavbar onLogout={handleLogout} />
      <div style={{ marginTop: '80px' }}> {/* Add margin for fixed navbar */}
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
