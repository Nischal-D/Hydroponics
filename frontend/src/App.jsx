import React, { useState } from 'react';
import AppNavbar from "../src/components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
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
