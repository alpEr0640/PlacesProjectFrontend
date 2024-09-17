import React, { useState } from "react";
import "../CSS/Navbar.css";
import logo from "../images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { setIsLogged } = useMainContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const goProfile = () => {
    navigate("/profile");
    setIsSidebarVisible(false);
  };
  const goHomepage = ()=>{
    navigate("/homepage");
    setIsSidebarVisible(false);
  }
  const goLocation = () => {
    navigate("/location");
    setIsSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <header className="NavBarContainer">
      <nav className="navBar">
        <div className="navLeft">
          <img className="navImage" src={logo} alt="Logo" />
        </div>
        <div className="navRight">
          <ul className="navItems">
            <NavLink className="navItems-Item" to="/homepage">
              Anasayfa
            </NavLink>
            <NavLink className="navItems-Item" to="/location">Konum Ara</NavLink>
            <li className="navItems-Item" onClick={goProfile}>
              Profil
            </li>
            <NavLink className="menuButton" onClick={toggleSidebar}>
              {isSidebarVisible ? (
                <i className="fa-solid fa-x menuBar"></i>
              ) : (
                <i className="fa-solid fa-bars menuBarfeci"></i>
              )}
            </NavLink>
          </ul>
        </div>

        <div className={`sideBarContainer ${isSidebarVisible ? "open" : ""}`}>
          <ul className="navSideBar">
            <li className="sideBar-Item" onClick={goHomepage}>
              Anasayfa
            </li>
            <li className="sideBar-Item" onClick={goLocation}>Konum Ara</li>
            <li className="sideBar-Item" onClick={goProfile}>
              Profil
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
