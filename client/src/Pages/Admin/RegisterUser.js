import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import "../../CSS/Admin/RegisterUser.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

export default function RegisterUser() {
  const [email, setEmail] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [quota, setQuota] = useState();
  const { validateToken } = useAuth();
  const backendurl = process.env.REACT_APP_BACKEND_URL;

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     validateToken(token);
  //   }
  // }, [validateToken]);
  const clearInputs = () => {
    setEmail("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setPhone("");
    setQuota("");
  };

  const submit = async () => {
    const payload = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
      phone: phone,
      quota: quota,
    };

    const token = localStorage.getItem("token");

    try {
      var res = await axios.post(`${backendurl}admin/registerUser`, payload, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status == 200) {
        Notify.success("Kullanıcı Kaydedildi");
        clearInputs();
      } else {
        Notify.failure("Kullanıcı Kaydedilemedi");
      }
    } catch (e) {
      console.log(e.response.data);
      const str = "Kullanıcı Kaydedilemedi: " + e.response.data.data;
      Notify.failure(str);
    }
  };

  return (
    <div className="registerUserContainer">
      <div className="registerUserContent">
        <div className="registerUserCard">
          <div className="cardHeader">
            <p>Kullanıcı Kayıt</p>
          </div>
          <div className="cardBody">
            <input
              placeholder="Email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <input
              placeholder="İsim"
              type="text"
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              value={firstname}
            />
            <input
              placeholder="Soyisim"
              type="text"
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              value={lastname}
            />
            <input
              placeholder="Telefon"
              type="tel"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              value={phone}
            />
            <input
              placeholder="Şifre"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            <input
              placeholder="Kota"
              type="number"
              onChange={(e) => {
                setQuota(e.target.value);
              }}
              value={quota}
            />
            <button onClick={submit}> Kaydet </button>
          </div>
        </div>
      </div>
    </div>
  );
}
