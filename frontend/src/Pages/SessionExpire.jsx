import React from "react";
import { FiAlertCircle } from "react-icons/fi"; // professional alert icon
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/"); // redirect to login page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f7ff",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <FiAlertCircle size={80} color="#748dff" />
      <h1 style={{ fontSize: "6rem", margin: "1rem 0", color: "#748dff" }}>401</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Session Expired</h2>
      <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "2rem", maxWidth: "500px" }}>
        Your session has expired due to inactivity. Please log in again to continue accessing your account.
      </p>
      <button
        onClick={handleLoginRedirect}
        style={{
          backgroundColor: "#748dff",
          color: "#fff",
          border: "none",
          padding: "0.8rem 2rem",
          fontSize: "1.1rem",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#5f73e0")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#748dff")}
      >
        Go to Login
      </button>
    </div>
  );
};

export default SessionExpired;