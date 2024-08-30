import React, { useEffect, useState } from "react";
import "../../CSS/Admin/Homepage.css";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const { validateToken } = useAuth();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [usersCount, setUsersCount] = useState("");
  const navigation = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     validateToken(token);
  //   }
  // }, [validateToken]);

  const getUsersCount = async (token) => {
    try {
      var res = await axios.get(`${backendurl}admin/getUsersCount`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(res.data.usersCount);
      setUsersCount(res.data.usersCount);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsersCount(token);
  }, []);

  return (
    <div className="homeContainer">
      <div className="homeContent">
        <div className="cards">
          <div
            className="card"
            onClick={() => {
              navigation("/admin/manageUsers");
            }}
          >
            <div className="cardHeader">
              <p>Kullanıcı Sayısı</p>
            </div>
            <div className="cardBody">
              <p>{usersCount}</p>
            </div>
          </div>
          <div
            className="card"
            onClick={() => {
              navigation("/admin/registerUser");
            }}
          >
            <div className="cardHeader">
              <p> </p>
            </div>
            <div className="cardBody">
              <p style={{ marginTop: "5%" }}>Kullanıcı Kaydet</p>
            </div>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p> asdsad </p>
            </div>
            <div className="cardBody">
              <p>asdsad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/*/ */
