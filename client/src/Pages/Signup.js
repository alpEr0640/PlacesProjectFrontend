import React, { useState } from "react";
import logo from "../images/Logo.png";
import "../CSS/Signup.css";
import axios from "axios";
import { Loading, Notify } from "notiflix";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [mail, setMail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      firstname: name,
      lastname: surname,
      email: mail,
      password: password,
      phone: phone,
    };
    console.log(payload);
    try {
      Loading.standard({ svgColor: "#00B4C4" });
      const response = await axios.post(`${backendurl}login/signup`, payload);
      console.log(response);
      Notify.success("Kullanıcı Başarıyla Oluşturuldu");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 400) {
          Notify.failure(error.response.data.data);
        } else if (error.response.status === 403) {
          Notify.failure("Bu mail adresiyle kayıtlı kullanıcı mevcut");
        } else if (error.response.status === 500) {
          Notify.failure("Beklenmedik Bir Hatayla Karşlıaştık");
        }
      } else {
        Notify.failure("Beklenmedik Bir Hatayla Karşlıaştık");
      }
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="signupContainer">
      <div className="signupContent">
        <div className="signupRightContent">
          <div className="signupRightContentHeader">
            <img src={logo} />
            Sector Scout
          </div>

          <form className="signupRightContentBody" onSubmit={submit}>
            <div className="signupField">
              <input
                placeholder="Ad"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                maxLength={20}
                minLength={2}
                required
              />
              <input
                placeholder="Soyad"
                onChange={(e) => {
                  setSurname(e.target.value);
                }}
                maxLength={20}
                minLength={2}
                required
              />
              <input
                placeholder="E-posta"
                required
                type="text"
                onChange={(e) => {
                  setMail(e.target.value);
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
              <input
                placeholder="Telefon Numarası"
                type="number"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                required
              />
            </div>
            <div className="signupBtnCover">
              <button className="signupBtn"> Kayıt Ol </button>
              <a className="signupContact" href="/">
                Hesabın var mı? <span>Giriş Yap</span>{" "}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
