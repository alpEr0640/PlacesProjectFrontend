import axios from "axios";
import { Loading, Notify } from "notiflix";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/ResetPassword.css"
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [secondPassword, setSecondPassword]= useState();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const postPassword = async (password,secondPassword) => {
    try {
      Loading.standard({ svgColor: "#00B4C4" });
      if(password===secondPassword){
        const response = await axios.post(
          `${backendurl}user/resetPassword`,
          { newPassword: password },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        Notify.success("Şifreniz Değiştirildi");
        navigate("/");
      }
      else{
        Notify.failure("Şifreler Eşleşmemektedir")
        /* throw new Error('Bir hata oluştu!') */
      }
      
    } catch (e) {
      if (e.response) {
        if (e.response.status === 403) {
          Notify.failure(e.response.data.data);
          console.log("deneme",e.response.data.data);
        }
        if (e.response.status === 400) {
          Notify.failure("Geçersiz Token");
          console.log(e.response);
        }
        if (e.response.status === 429) {
          Notify.failure("İstek Limitini Aştınız");
          console.log(e.response);
        }
      } else {
        Notify.failure("Server Hatası");
        console.log("asdf", e.response);
      }
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="resetPasswordContainer">
    <div className="resetPasswordContent">
      <div className="resetPasswordHeader">
        <p> Şifre Sıfırla</p>
      </div>
      <div className="resetPasswordBody">
        <input
          onBlur={(e) => setPassword(e.target.value)}
          placeholder="Yeni Şifre"
          type="password"
        />
         <input
          onBlur={(e) => setSecondPassword(e.target.value)}
          placeholder="Yeni Şifre Tekrar"
          type="password"
        />
        <button onClick={() => postPassword(password,secondPassword)}>Yeni Şifre Al</button>
      </div>
    </div>
  </div>
  );
}
