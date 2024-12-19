import React, { useEffect, useState } from "react";
import styles from "../../CSS/Admin/Homepage.module.css";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const { validateToken } = useAuth();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [usersCount, setUsersCount] = useState("");
  const [formsCount, setFormsCount] = useState("");
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
      setUsersCount(res.data.usersCount);
    } catch (e) {
      console.log(e);
    }
  };

  const getFormsCount = async (token) => {
    try {
      var res = await axios.get(`${backendurl}admin/getFormsCount`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setFormsCount(res?.data?.formsCount?? "");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsersCount(token);
    getFormsCount(token);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <div className={styles.cards}>
          <div
            className={styles.card}
            onClick={() => {
              navigation("/admin/manageUsers");
            }}
          >
            <div className={styles.cardHeader}>
              <p>Kullanıcı Sayısı</p>
            </div>
            <div className={styles.cardBody}>
              <p>{usersCount}</p>
            </div>
          </div>
          <div
            className={styles.card}
            onClick={() => {
              navigation("/admin/registerUser");
            }}
          >
            <div className={styles.cardHeader}>
              <p> </p>
            </div>
            <div className={styles.cardBody}>
              <p style={{ marginTop: "5%" }}>Kullanıcı Kaydet</p>
            </div>
          </div>
          <div
            className={styles.card}
            onClick={() => {
              navigation("/admin/manageForms");
            }}
          >
             <div className={styles.cardHeader}>
              <p>Form Sayısı</p>
            </div>
            <div className={styles.cardBody}>
              <p>{formsCount}</p>
            </div>
          </div>
          {/* <div className="card">
            <div className="cardHeader">
              <p> asdsad </p>
            </div>
            <div className="cardBody">
              <p>asdsad</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
/*/ */
