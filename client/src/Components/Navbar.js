import React, { useEffect, useState } from "react";
import "../CSS/Navbar.css";
import logo from "../images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import { AuthProvider, useAuth } from "../AuthContext";
export default function Navbar() {
  const navigate = useNavigate();
  const { setIsLogged } = useMainContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { isAdmin } = useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0); 

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar); // Scroll eventini dinle

    return () => {
      window.removeEventListener("scroll", controlNavbar); // Component unmount olduğunda listener'ı kaldır
    };
  }, [lastScrollY]);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {  
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY); // Son kaydırma pozisyonunu güncelle
  };

  const goProfile = () => {
    navigate("/profile");
    setIsSidebarVisible(false);
  };
  const goHomepage = () => {
    navigate("/homepage");
    setIsSidebarVisible(false);
  };
  const goLocation = () => {
    navigate("/location");
    setIsSidebarVisible(false);
  };
  const goMyData = () => {
    navigate("/data");
    setIsSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  const goAdmin = ()=>{
    navigate("/admin/home");
    setIsSidebarVisible(false);
  }

  return isAdmin ? (
    <header className={`NavBarContainer ${showNavbar ? "visible" : "hidden"} `} >
      <nav className="navBar">
        <div className="navLeft">
          <img className="navImage" src={logo} alt="Logo" />
          <p> Sector Scout</p>
        </div>
        <div className="navRight">
          <ul className="navItems">
            <NavLink className="navItems-Item" to="/homepage">
              Anasayfa
            </NavLink>
            <NavLink className="navItems-Item" to="/location">
              Konum Ara
            </NavLink>
            <NavLink className="navItems-Item" to="/data">
              Geçmiş Aramalar
            </NavLink>
            <NavLink className="navItems-Item" to="/admin/home">
              Admin
            </NavLink>
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
            <li className="sideBar-Item" onClick={goLocation}>
              Konum Ara
            </li>
            <li className="sideBar-Item" onClick={goMyData}>
              Geçmiş Aramalar
            </li>
            <li className="sideBar-Item" onClick={goAdmin}>
              Admin
            </li>
            <li className="sideBar-Item" onClick={goProfile}>
              Profil
            </li>
          </ul>
        </div>
      </nav>
    </header>
  ) : (<header className={`NavBarContainer ${showNavbar ? "visible" : "hidden"} `}>
    <nav className="navBar">
      <div className="navLeft">
        <img className="navImage" src={logo} alt="Logo" />
        <p> Sector Scout</p>
      </div>
      <div className="navRight">
        <ul className="navItems">
          <NavLink className="navItems-Item" to="/homepage">
            Anasayfa
          </NavLink>
          <NavLink className="navItems-Item" to="/location">
            Konum Ara
          </NavLink>
          <NavLink className="navItems-Item" to="/data">
            Geçmiş Aramalar
          </NavLink>
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
          <li className="sideBar-Item" onClick={goLocation}>
            Konum Ara
          </li>
          <li className="sideBar-Item" onClick={goMyData}>
            Geçmiş Aramalar
          </li>
          <li className="sideBar-Item" onClick={goProfile}>
            Profil
          </li>
        </ul>
      </div>
    </nav>
  </header>);
}
