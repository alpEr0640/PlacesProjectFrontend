import React, { Children, useContext, useState } from "react";
import "../CSS/Login.css";
import image from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import { AuthProvider, useAuth } from "../AuthContext";
import { Notify } from "notiflix";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigate();
  const { validateToken  } = useAuth();
  const backendurl= process.env.REACT_APP_BACKEND_URL
  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      email: username,
      password: password,
    };

    try {
      const res = await axios.post(
        `${backendurl}login/signin`,
        payload
      );
      setErrorMessage("");
      console.log(res.data.data)
     
      window.localStorage.setItem("token", res.data.data);
      validateToken(res.data.data);
      navigation("/homepage");
      Notify.info('Giriş Başarılı');
    } catch (e) {
      console.log(e.response.status)
      if (e.response.status===404 ) {
        setErrorMessage("Kullanıcı Bulunamadı")
      }
      if (e.response.status===401 ) {
        setErrorMessage("Hatalı Şifre Girdiniz")
      } if (e.response.status===500 ) {
        setErrorMessage("Server Hatası")
      }
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginContent">
        <div className="loginLeftContent">
          <img src={image} className="loginImage"></img>
        </div>
        <div className="loginRightContent">
          <div className="rightContentHeader">Customer Compass</div>
          <form className="rightContentBody">
            <div className="loginField">
              {errorMessage && <div className="error">{errorMessage}</div>}
              <input
                placeholder="Kullanıcı Adı"
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="btnCover">
              <button className="btn" onClick={submit}>
                {" "}
                Giriş Yap{" "}
              </button>
              <a className="loginContact">Şifremi Unuttum</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
