import React from "react";
import { Link } from "react-router-dom";

const HeaderLanding: React.FC = () => {
  return (
    <div
      style={{
        marginBottom: "-55px",
        display: "flex",
        flexWrap: "wrap", 
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1.5rem",
        backgroundColor: "#ebaf8d",
        width: "100%",
        margin: "0",
        boxSizing: "border-box",
        position: "relative",
        top: 0,
      }}
    >
      <div style={{display: "flex",alignItems: "center",gap: "0.3rem",marginBottom: "0.5rem", }}
      >
        <span style={{ fontSize: "1.5rem", color: "black" }}>💬</span>
        <h1 style={{ fontSize: "1.4rem", color: "black", margin: 0 }}>
          App Name
        </h1>
      </div>

      <nav style={{display: "flex",flexWrap: "wrap", gap:"1.4rem", alignItems:"center",justifyContent:"center", width: "100%",maxWidth: "600px"}}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "black",
            fontSize: "1.2rem",
             fontWeight: "bold",
            }}
        >
          Home
        </Link>
        <Link
          to="/AboutUs"
          style={{
            textDecoration: "none",
            color: "black",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          About Us
        </Link>
        <Link
          to="/team"
          style={{
            textDecoration: "none",
            color: "black",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Teams
        </Link>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap", 
            justifyContent: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              backgroundColor: "black",
              color: "#ebaf8d",
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "0.3rem 0.8rem",
              borderRadius: "15px",
            }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "0.3rem 0.8rem",
              borderRadius: "15px",
              border: "2px solid black",
            }}
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default HeaderLanding;
