import React, { useState, useEffect } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { Leaf, User } from "lucide-react";

const AppNavbar = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

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
    alert("Admin button clicked! You can open a dropdown or navigate here.");
  };

  return (
    <Navbar
      style={{ backgroundColor: "#43a459" }}
      variant="dark"
      expand="lg"
      fixed="top"
      className="shadow"
    >
      <Container fluid className="px-4 position-relative d-flex align-items-center">
        <Navbar.Brand className="d-flex align-items-center gap-2 flex-shrink-0">
          <Leaf size={24} />
          <span className="d-none d-sm-inline">Hydroponics</span>
        </Navbar.Brand>

        <div
          className="position-absolute start-50 translate-middle-x d-flex align-items-center gap-2 text-light"
          style={{ whiteSpace: "nowrap" }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#3fe355",
              borderRadius: "50%",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span>System: Running</span>
        </div>

        <div className="d-flex align-items-center gap-4 ms-auto text-light flex-nowrap">
          <div className="d-none d-md-block">{currentDate} | {currentTime}</div>

          <Button
            variant="outline-light"
            onClick={handleAdminClick}
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "50px",
              height: "50px",
              padding: 0,
              borderRadius: "50%",
            }}
          >
            <User size={24} />
          </Button>
        </div>

        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }

           /
            @media (max-width: 576px) {
              .navbar-brand span {
                display: none;
              }
            }
          `}
        </style>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
