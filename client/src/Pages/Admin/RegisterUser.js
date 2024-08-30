import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import axios from "axios";

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
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div>
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          placeholder="İsim"
          type="text"
          onChange={(e) => {
            setFirstname(e.target.value);
          }}
        />
        <input
          placeholder="Soyisim"
          type="text"
          onChange={(e) => {
            setLastname(e.target.value);
          }}
        />
        <input
          placeholder="Telefon"
          type="tel"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <input
          placeholder="Şifre"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          placeholder="Kota"
          type="number"
          onChange={(e) => {
            setQuota(e.target.value);
          }}
        />
        <button onClick={submit}> Kaydet </button>
      </div>
    </div>
  );
}
