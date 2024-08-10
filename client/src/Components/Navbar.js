import React, { useState } from "react";
import "../CSS/Navbar.css";
import logo from "../images/images.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { setIsLogged } = useMainContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("logged");
    setIsLogged(false);
    navigate("/");
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
            <NavLink className="navItems-Item">Konum Ara</NavLink>
            <li className="navItems-Item" onClick={logout}>
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
            <NavLink className="sideBar-Item" to="/homepage">
              Anasayfa
            </NavLink>
            <NavLink className="sideBar-Item">Konum Ara</NavLink>
            <NavLink className="sideBar-Item" to="/">
              Profil
            </NavLink>
          </ul>
        </div>
      </nav>
    </header>
  );
}
