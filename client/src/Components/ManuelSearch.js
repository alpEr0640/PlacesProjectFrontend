import React, { useEffect, useState } from "react";
import "../CSS/ManuelSearch.css";
import axios from "axios";
import { Loading, Notify } from "notiflix";
import { useMainContext } from "../MainContext";
import { useAuth } from "../AuthContext";
export default function ManuelSearch() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState("");
  const [temp, setTemp] = useState(false);
  const [adress, setAdress] = useState("");
  const apiKey = process.env.REACT_APP_APIKEY;
  const [trigger, setTrigger] = useState(false);
  const [tempArray, setTempArray] = useState("");
  const [locationY, setLocationY] = useState(null);
  const [locationX, setLocationX] = useState(null);
  const [country, setCountry] = useState("");
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [nextPageToken, setNextPageToken] = useState("");
  const { setGlobalSearch, globalSearch, globalAddress, setGlobalAddress } =
    useMainContext();
  const [emailCheckTemp, setEmailCheckTemp] = useState(false);
  const { validateToken } = useAuth();
  const [jobID, setJobID] = useState("0");
  useEffect(() => {
    if (locationX !== null && locationY !== null) {
      checkQuota();
    }
  }, [locationX, locationY, trigger]);
  const handleGeocode = async () => {
    const fullAdress = country + " " + city + " " + state + " " + adress;
    setGlobalAddress(fullAdress + ", " + type);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAdress
        )}&key=${apiKey}`
      );
      const data = response.data;
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;

        setLocationX(location.lat);
        setLocationY(location.lng);

        /* setTrigger(prev => !prev);  */
      } else {
        Notify.failure("Adres Bulunamadı");
        Loading.remove();
        throw new Error();
      }
    } catch (e) {
      Loading.remove();
      Notify.failure("Server Hatası");

      console.log(e);
    }
  };

  const checkQuota = async (pageToken = "") => {
    const token = window.localStorage.getItem("token");
    //! kota kontrol isteği
    try {
      const checkQuotaRes = await axios.get(`${backendurl}home/checkQuota`, {
        headers: {
          Authorization: token,
        },
      });

      if (checkQuotaRes.data.result === true) {
        handleTextSearch();
      }
    } catch (e) {
      if (e.response.status === 429) {
        Notify.failure("Çok Fazla İstek Göndermeye Çalıştınız");
        Loading.remove();
      }
      if (e.response.status === 403) {
        if (e.response.data.err) {
          Notify.failure("Kotanız Bulunmamaktadır");
          Loading.remove();
        } else {
          Loading.remove();
        }
      }
      if (e.response.status === 402) {
        Notify.failure("Aboneliğiniz Bulunmamaktadır");
        Loading.remove();
      } else {
        Notify.failure("Beklenmedik Bİr Hatayla Karşılaştık");
        Loading.remove();
      }
    }
  };

  const handleTextSearch = async (pageToken) => {
    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: type,

          locationBias: {
            circle: {
              center: { latitude: locationX, longitude: locationY },
              radius: 500.0,
            },
          },
          rankPreference: "DISTANCE",
          pageToken: pageToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.userRatingCount,nextPageToken,places.websiteUri,places.internationalPhoneNumber",
          },
        }
      );

      if (response.data.places) {
        const newPlaces = response.data.places;
        setTempArray((tempArray) => [...tempArray, ...newPlaces]);
        setGlobalSearch("");
        setEmailCheckTemp(false);
      } else {
        Notify.failure("Sonuç Bulunamadı");
      }

      if (response.data.nextPageToken) {
        handleTextSearch((pageToken = response.data.nextPageToken));
      } else {
        setNextPageToken("");
        if (response.status === 200) {
          setEmailCheckTemp(true);
        }
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 400) {
          Notify.failure("Arama Tipi Boş Olamaz");
        }
      } else {
        Notify.failure("Server Hatası");
      }

      Loading.remove();
    }
  };
  useEffect(() => {
    if (emailCheckTemp) {
      checkEmail(tempArray);
    }
  }, [emailCheckTemp]);

  const checkEmail = async (tempArray) => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${backendurl}home/getEmails`,
        { data: tempArray },
        {
          headers: {
            Authorization: token,
          },
          timeout: 300000,
        }
      );
      if (response.status === 200) {
        setJobID(response.data.jobId);
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 400) {
          Notify.failure("Sistem Yoğun Kısa Bir Süre Bekleyip Tekrar Deneyin");
          Loading.remove();
        } else {
          Notify.failure("Beklenmeyen Bir Hatayla Karşılaşıldı");
          Loading.remove();
        }
      } else {
        Notify.failure("Beklenmeyen Bir Hatayla Karşılaşıldı");
        Loading.remove();
      }
    }
  };
  useEffect(() => {
    scrapStatus(jobID);
    console.log("JobId UseEffect: ", jobID);
  }, [jobID]);

  const scrapStatus = async (jobId) => {
    const token = window.localStorage.getItem("token");
    console.log("jobId: ", jobId);
    try {
      const response = await axios.get(
        `${backendurl}home/getScrapStatus/${jobId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (!response.data.result) {
        setTimeout(() => scrapStatus(jobId), 5000);
        console.log("merhaba");
      } else {
        setTempArray(response.data.result); //responseyi kontrol et oraya dizi göndermen gerekiyor
        decreaseQuota();
      }
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const decreaseQuota = async () => {
    const token = window.localStorage.getItem("token");
    try {
      const decreaseQuotaRes = await axios.put(
        `${backendurl}home/decreaseQuota`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTemp(!temp);
      Notify.info("Arama Tamamlandı");
    } catch (e) {
      Loading.remove();
      Notify.failure("Beklenmeyen Bir Hata Oluştu");
    }
  };

  useEffect(() => {
    setGlobalSearch((globalSearch) => [...globalSearch, ...tempArray]);
    Loading.remove();
    setTempArray("");
  }, [temp]);
  useEffect(() => {
    window.localStorage.setItem("mySearch", JSON.stringify(globalSearch));
    window.localStorage.setItem("myAddress", globalAddress);
  }, [globalSearch]);

  const handleButtonClick = async () => {
    const token = window.localStorage.getItem("token");
    validateToken(token);
    Loading.standard("Sayfayı Yenilemeyin, Sizin İçin Araştırma Yapıyoruz", {
      svgColor: "#00B4C4",
      messageMaxLength: "70",
    });

    await handleGeocode();
    setTrigger((prev) => !prev);
  };
  return (
    <div className="manuelSearchContainer">
      <div className="manuelSearchContent">
        <div className="manuelSearchCoordinates">
          {" "}
          <input
            placeholder="Ülke"
            onBlur={(e) => setCountry(e.target.value)}
          />
          <input placeholder="Şehir" onBlur={(e) => setCity(e.target.value)} />
        </div>
        <div className="manuelSearchDetail">
          {" "}
          <input placeholder="İlçe" onBlur={(e) => setState(e.target.value)} />
          <input
            placeholder="Adres"
            onBlur={(e) => setAdress(e.target.value)}
          />
        </div>
        <div className="manuelSearchButton">
          <input
            className="locationSearchDetail"
            placeholder="Aramak İstediğiniz Tür"
            onBlur={(e) => setType(e.target.value)}
          />{" "}
          <button onClick={handleButtonClick}>Manuel Arama</button>
        </div>
      </div>
    </div>
  );
}
