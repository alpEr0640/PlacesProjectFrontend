import React, { useEffect } from "react";
import "../CSS/Homepage.css";
import "animate.css";
import { AuthProvider, useAuth } from "../AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Subs from "../Components/SubscriptionsPlan"
import Landing from "../Components/LandingPage"
export default function Homepage() {
  const navigate = useNavigate();
  const { isAuthenticated, validateToken } = useAuth();
  const goProfile = () => {
    navigate("/profile");
  };

  const goLocation = ()=>{
    navigate("/location")
  }

 
  return (<div className="hompageContainer">
  
    <div className="homepageContainer" id="home">
      <div className="homepageContent">
        <h1 className="homepageHeader animate__animated animate__bounceanimate__animated animate__fadeInTopLeft">
          {" "}
          <span>Sector Scout'a</span>
          <span>Hoş Geldiniz</span>
        </h1>
        <div className="homepageButtons">
          <button className="homepageButtons-button" onClick={goLocation}>Konum Ara</button>
          <button className="homepageButtons-button" onClick={goProfile}>
            Profil
          </button>
        </div>
      </div>
    </div>
   {/*  <Landing/> */}
    <Subs/>
    </div>
  );
}
