import React, { useEffect, useState } from "react";
import "../CSS/Profile.css";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";
export default function Profile() {
  const navigate = useNavigate();
  const { setIsLogged, isLogged, isLoading } = useMainContext();
  const { validateToken } = useAuth();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [profileData, setProfileData] = useState("");

  useEffect(() => {
    /*  Loading.standard({ svgColor: "#00B4C4" }); */
    const token = localStorage.getItem("token");

    if (token) {
      validateToken(token);
    }
  }, []);

  const Logout = () => {
    try {
      Loading.standard({ svgColor: "#00B4C4" });
      window.localStorage.removeItem("token");
      validateToken(localStorage.getItem("token"));
      console.log("Çıkış kontrol", isLogged);
    } catch (e) {
      console.log(e);
    }
    finally{
      Loading.remove();
    }
  };

  const getUser = async (token) => {
    try {
      var res = await axios.get(`${backendurl}home/getUser`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setProfileData(...profileData, res.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      Loading.remove();
    }
  };

  useEffect(() => {
    Loading.standard({ svgColor: "#00B4C4" });
    const token = localStorage.getItem("token");
    getUser(token);
  }, []);

  return (
    <div className="profileContainer">
      <div className="profileContent">
        <div className="profileContentHeader">
          <div className="profileHeaderContent">Profil Detayları</div>
        </div>
        <div className="profileContentBody">
          <div className="profileContentBody-Left">
            <p>
              Ad<span>:</span>
            </p>
            <p>
              Soyad <span>:</span>
            </p>
            <p>
              E-Posta<span>:</span>
            </p>
            <p>
              Telefon<span>:</span>
            </p>
            <p>
              Kalan Hak<span>:</span>
            </p>
          </div>
          <div className="profileContentBody-Right">
            <p> {profileData.firstname}</p>
            <p> {profileData.lastname}</p>
            <p> {profileData.email}</p>
            <p> {profileData.phone}</p>
            <p> {profileData.quota}</p>
          </div>
        </div>
        <div className="logutContainer ">
          <button onClick={Logout}> Çıkış Yap</button>
        </div>
      </div>
    </div>
  );
}
