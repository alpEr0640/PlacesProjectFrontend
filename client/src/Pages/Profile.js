import React, { useEffect, useState } from "react";
import "../CSS/Profile.css";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Notify } from "notiflix";
export default function Profile() {
  const navigate = useNavigate();
  const { globalSearch, setGlobalSearch, globalAddress, setGlobalAddress } =
    useMainContext();
  const { validateToken } = useAuth();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [profileData, setProfileData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const Logout = () => {
    try {
      Loading.standard({ svgColor: "#00B4C4" });
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("mySearch");
      window.localStorage.removeItem("myAddress");
      validateToken(localStorage.getItem("token"));
      setGlobalSearch("");
      setGlobalAddress("");
    } catch (e) {
      console.log(e);
      if (e.response.status === 429) {
        Notify.failure("Çok Fazla İstek Göndermeye Çalıştınız");
        Loading.remove();
      } else {
        Notify.failure("Beklenmeyen Bir Hata Oluştu");
        Loading.remove();
      }
    } finally {
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
      Notify.failure("Bilgiler Getirilemedi")
      console.log(e);
    } finally {
      Loading.remove();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Loading.standard({ svgColor: "#00B4C4" });
    const token = localStorage.getItem("token");
    validateToken(token);
    getUser(token);
  }, []);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <>
      <div className="profileContainer">
        <div className="profileContent">
          <div className="profileContentHeader">
            <div className="profileHeaderContent">Profil Detayları</div>
          </div>
          <div className="profileContentBody">
            {isLoading ? (
              Loading.standard({ svgColor: "#00B4C4" })
            ) : (
              <>
                <div className="profileContentBody-Left">
                  <p>
                    Ad Soyad<span> : </span>
                  </p>
                  <p>
                    Abonelik <span> : </span>
                  </p>
                  <p>
                    E-Posta <span> : </span>
                  </p>
                  <p>
                    Telefon <span> : </span>
                  </p>
                  <p>
                    Kalan Hak <span> : </span>
                  </p>
                  <p> Abonelik Bitiş Tarihi <span>: </span></p>
                </div>
                <div className="profileContentBody-Right">
                  <p> {profileData.firstname +" "+ profileData.lastname }</p>
                  <p> {profileData.subscriptionPlan ?profileData.subscriptionPlan : "Abonelik Bulunamadı" }</p>
                  <p> {profileData.email}</p>
                  <p> {profileData.phone}</p>
                  <p> {profileData.quota}</p>
                  <p> {formatDate(profileData.subscriptionEndDate)}</p>
                </div>
              </>
            )}
          </div>
          <div className="logutContainer ">
            <button onClick={Logout}> Çıkış Yap</button>
          </div>
        </div>
      </div>
    </>
  );
}
