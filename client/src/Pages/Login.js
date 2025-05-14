import React, { Children, useContext, useState } from "react";
import "../CSS/Login.css";
import logo from "../images/Logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import { AuthProvider, useAuth } from "../AuthContext";
import { Loading, Notify } from "notiflix";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { validateToken } = useAuth();
  const backendurl = process.env.REACT_APP_BACKEND_URL;

  const goForgotPassword = () => {
    navigate("/forgotPassowrd");
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      email: username,
      password: password,
    };

    try {
      Loading.standard({ svgColor: "#00B4C4" });
      const res = await axios.post(`${backendurl}login/signin`, payload);
      setErrorMessage("");
      window.localStorage.setItem("token", res.data.data);
      validateToken(res.data.data);
      navigate("/homepage");
      Notify.info("Giriş Başarılı");
    } catch (e) {
      console.log(e);
      if (e.code === "ERR_NETWORK") {
        setErrorMessage("Server Hatası");
      } else {
        if (e.response.status === 400) {
          setErrorMessage("Mail Veya Şifre Gerekli");
        }
        if (e.response.status === 404) {
          setErrorMessage("Kullanıcı Bulunamadı");
        }
        if (e.response.status === 401) {
          setErrorMessage("Hatalı Şifre Girdiniz");
        }
        if (e.response.status === 429) {
          setErrorMessage("İstek Limitini Aştınız");
        }
        if (e.response.status === 500) {
          setErrorMessage("Server Hatası");
        }
      }
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginContent">
        <div className="loginRightContent">
          <div className="rightContentHeader">
            <img src={logo} />
            Sector Scout
          </div>
          <form className="rightContentBody" onSubmit={submit}>
            <div className="loginField">
              {errorMessage && <div className="error">{errorMessage}</div>}
              <input
                placeholder="E-posta"
                required
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                placeholder="Şifre"
                type="password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="btnCover">
              <button className="loginBtn"> Giriş Yap </button>
              <div className="loginContactContainer">
                <a className="loginContact forget" onClick={() => goForgotPassword()}>
                  Şifremi Unuttum
                </a>
                <a className="loginContact" href="/signup"> Hesabın yok mu? <span>Kayıt Ol</span></a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
