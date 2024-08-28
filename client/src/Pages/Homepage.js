import React, { useEffect } from "react";
import "../CSS/Homepage.css";
import "animate.css";
import { AuthProvider, useAuth } from "../AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
export default function Homepage() {
  const navigate = useNavigate();
  const { isAuthenticated, validateToken } = useAuth();
  const goProfile = () => {
    navigate("/profile");
  };
  /* useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    }
  }, [validateToken]); */
  return (
    <div className="homepageContainer">
      <div className="homepageContent">
        <h1 className="homepageHeader animate__animated animate__bounceanimate__animated animate__fadeInTopLeft">
          {" "}
          <span>Customer Compass'a</span>
          <span>Hoş Geldiniz</span>
        </h1>
        <div className="homepageButtons">
          <button className="homepageButtons-button">Konum Ara</button>
          <button className="homepageButtons-button" onClick={goProfile}>
            Profil
          </button>
        </div>
      </div>
    </div>
  );
}
