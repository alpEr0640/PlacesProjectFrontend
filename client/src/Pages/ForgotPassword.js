import axios from "axios";
import { Loading, Notify } from "notiflix";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const backendurl = process.env.REACT_APP_BACKEND_URL;

  const postMail = async (email) => {
    Loading.standard({ svgColor: "#00B4C4" });
    try {
      const response = await axios.post(
        `${backendurl}user/sendPasswordResetMail`,
        { email: email }
      );
      console.log(response);
      Notify.success("Şifre Sıfırlama Maili Gönderildi");
      navigate("/");
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          Notify.failure("Mail Adresi Bulunamadı");
        } else if (e.response.status === 401) {
          Notify.failure("Beklenmeyen Bir Hata Oluştu");
        } else if (e.response.status === 429) {
          Notify.failure("İstek Limitini Aştınız");
          console.log(e.response);
        } else {
          Notify.failure("Beklenmeyen Bir Hata Oluştu");
        }
      } else {
        Notify.failure("Server Hatası");
        console.log(e);
      }
    } finally {
      Loading.remove();
    }
  };
  return (
    <div className="resetContainer">
      <div className="resetContent">
        <div className="resetHeader">
          <p> Şifre Sıfırla</p>
        </div>
        <div className="resetBody">
          <input
            onBlur={(e) => setEmail(e.target.value)}
            placeholder="Mail Adresi Gir"
            type="email"
          />
          <button onClick={() => postMail(email)}>Yeni Şifre Al</button>
        </div>
      </div>
    </div>
  );
}
