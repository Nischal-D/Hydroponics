import React, { useState, useEffect } from "react";
import { Container, Navbar, Button, Modal } from "react-bootstrap";
import { Leaf, User, LogOut, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppNavbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleAdminClick = () => {
    navigate("/plant-setup");
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <>
      <Navbar
        fixed="top"
        expand="lg"
        variant="dark"
        className="shadow"
        style={{ backgroundColor: "#43a459" }}
      >
        <Container fluid className="px-4 position-relative d-flex align-items-center">
          
          {/* Brand */}
          <Navbar.Brand
            className="d-flex align-items-center gap-2 flex-shrink-0"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Leaf size={24} />
            <span className="d-none d-sm-inline">Hydroponics</span>
          </Navbar.Brand>

          {/* System Status */}
          <div
            className="position-absolute start-50 translate-middle-x d-flex align-items-center gap-2 text-light"
            style={{ whiteSpace: "nowrap" }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#3fe355",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}
            />
            <span>System: Running</span>
          </div>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-3 ms-auto text-light flex-nowrap">
            
            <div className="d-none d-md-block me-3">
              {currentDate} | {currentTime}
            </div>

            {/* Admin / Plant Setup */}
            <Button
              variant="outline-light"
              onClick={handleAdminClick}
              title="Plant Setup"
              className="d-flex align-items-center justify-content-center border-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <User size={20} />
            </Button>

            {/* Logout */}
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogoutClick}
              className="d-flex align-items-center gap-2 ms-2"
              style={{ borderRadius: 20 }}
            >
              <LogOut size={16} />
              <span className="d-none d-md-inline">Logout</span>
            </Button>
          </div>

          {/* Animations */}
          <style>
            {`
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            `}
          </style>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutConfirm}
        onHide={() => setShowLogoutConfirm(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0" />
        <Modal.Body className="text-center pt-0 pb-4">
          <div className="mb-3 text-warning">
            <AlertTriangle size={48} />
          </div>

          <h4 className="fw-bold mb-2">Confirm Logout</h4>
          <p className="text-muted mb-4">
            Are you sure you want to log out?
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="light"
              onClick={() => setShowLogoutConfirm(false)}
              className="px-4 rounded-pill"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmLogout}
              className="px-4 rounded-pill"
            >
              Yes, Logout
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
