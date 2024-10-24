import axios from "axios";
import React, { useEffect, useState } from "react";
import "../CSS/LocationSearch.css";
import { useMainContext } from "../MainContext";
import { Loading, Notify } from "notiflix";
import { useAuth } from "../AuthContext";
function LocationSearch() {
  const [lng, setLng] = useState(null); //!sola sağa giderken değişiyor
  const [lat, setLat] = useState(null); //! aşağı yukarı giderken değişiyor
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [distance, setDistance] = useState("");
  const [leftLat, setLeftLat] = useState(null);
  const [leftLng, setLeftLng] = useState(null);
  const [rightLat, setRightLat] = useState(null);
  const [rightLng, setRightLng] = useState(null);
  const latDegree = 111.32;
  const apiKey = process.env.REACT_APP_APIKEY;
  const [trigger, setTrigger] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");
  const { setGlobalSearch, globalSearch, globalAddress, setGlobalAddress } =
    useMainContext();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [tempArray, setTempArray] = useState("");
  const [temp, setTemp] = useState(false);
  const { validateToken } = useAuth();
  const [emailCheckTemp, setEmailCheckTemp] = useState(false);
  const [jobID, setJobID] = useState("0");
  const [jobIDCheck, setJobIDCheck] = useState(false);
  const calculateCoordinate = () => {
    setEmailCheckTemp(false);
    setJobIDCheck(false);
    const token = window.localStorage.getItem("token");
    validateToken(token);
    Loading.standard("Sayfayı Yenilemeyin, Sizin İçin Araştırma Yapıyoruz", {
      svgColor: "#00B4C4",
      messageMaxLength: "70",
    });
    const num = parseFloat(area);
    if (!isNaN(num)) {
      const calculatedDistance = Math.sqrt(num) / 2;
      setDistance(calculatedDistance);
      const latInDegrees = parseFloat(lat);
      const lngInDegrees = parseFloat(lng);
      const distanceInDegreesLat = calculatedDistance / latDegree;
      const distanceInDegreesLng =
        calculatedDistance /
        (latDegree * Math.cos((latInDegrees * Math.PI) / 180));
      setLeftLat(latInDegrees - distanceInDegreesLat);
      setLeftLng(lngInDegrees - distanceInDegreesLng);
      setRightLat(latInDegrees + distanceInDegreesLat);
      setRightLng(lngInDegrees + distanceInDegreesLng);
      const fullAdress = lat + ", " + lng + ", " + area + ", " + type;
      setGlobalAddress(fullAdress);
    } else {
      const calculatedDistance = Math.sqrt(16) / 2;
      setDistance(4);
      const latInDegrees = parseFloat(lat);
      const lngInDegrees = parseFloat(lng);
      const distanceInDegreesLat = calculatedDistance / latDegree;
      const distanceInDegreesLng =
        calculatedDistance /
        (latDegree * Math.cos((latInDegrees * Math.PI) / 180));
      setLeftLat(latInDegrees - distanceInDegreesLat);
      setLeftLng(lngInDegrees - distanceInDegreesLng);
      setRightLat(latInDegrees + distanceInDegreesLat);
      setRightLng(lngInDegrees + distanceInDegreesLng);
      const fullAdress = lat + ", " + lng + ", " + area + ", " + type;
      setGlobalAddress(fullAdress);
      /* setDistance(4);
      setArea(16); */
    }
    setTrigger(true);
  };

  useEffect(() => {
    if (
      trigger &&
      leftLat !== null &&
      leftLng !== null &&
      rightLat !== null &&
      rightLng !== null
    ) {
      checkQuota();
    }
  }, [trigger, leftLat, leftLng, rightLat, rightLng]);

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
        fetchData();
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
      } else {
        Notify.failure("Beklenmedik Bİr Hatayla Karşılaştık");
        Loading.remove();
      }
    }
  };

  const fetchData = async (pageToken = "") => {
    try {
      if (lat === null || lng === null || isNaN(lng) || isNaN(lat)) {
        throw new Error("NULLCOORDINATE");
      }
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: type,
          locationRestriction: {
            rectangle: {
              low: {
                latitude: leftLat,
                longitude: leftLng,
              },
              high: {
                latitude: rightLat,
                longitude: rightLng,
              },
            },
          },
          pageSize: 20,
          pageToken: pageToken,
          rankPreference: "RELEVANCE",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,nextPageToken,places.websiteUri,places.internationalPhoneNumber",
          },
        }
      );
      const newPlaces = response.data.places;
      if (Array.isArray(newPlaces)) {
        setTempArray((tempArray) => [...tempArray, ...newPlaces]);
        setGlobalSearch("");
      }

      if (response.data.nextPageToken && newPlaces.length !== 0) {
        fetchData(response.data.nextPageToken);
      } else {
        setNextPageToken("");

        if (response.status === 200) {
          setEmailCheckTemp(true);
          setJobIDCheck(true);
        }
      }
    } catch (error) {
      setEmailCheckTemp(false);
      setJobIDCheck(false);
      if (error.message) {
        if (error.message === "NULLCOORDINATE") {
          Notify.failure("koodinatlar Boş Olamaz");
        }
      } else {
        Notify.failure("Arama Tipi Boş Olamaz");
        console.error("Error fetching places:", error);
      }
      Loading.remove();
    } finally {
      setTrigger(false);
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
          timeout: 120000,
        }
      );

      if (response.status === 200) {
        setJobID(response.data.jobId);
      }
    } catch (e) {
      setEmailCheckTemp(false);
      setJobIDCheck(false);
      console.log(e);
      if (e.code) {
        if (e.code === "ECONNABORTED") {
          Notify.failure("Veriler Getirilemedi");
          Loading.remove();
        }
      }
      if (e.response) {
        if (e.response.status === 400) {
          Notify.failure("Veri Bulunamadı");
          decreaseQuota();
        } else if (e.response.status === 403) {
          Notify.failure("Sistem Yoğun Kısa Bir Süre Bekleyip Tekrar Deneyin");
          Loading.remove();
        } else {
          Notify.failure("Beklenmeyen Bir Hatayla Karşılaştık");
          Loading.remove();
        }
      } else {
        Notify.failure("Beklenmeyen Bir Hatayla Karşılaştık");
        Loading.remove();
      }
    }
  };

  useEffect(() => {
    if (jobIDCheck) {
      scrapStatus(jobID);
    }
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
      } else {
        setTempArray(response.data.result); //responseyi kontrol et oraya dizi göndermen gerekiyor
        decreaseQuota();
      }
    } catch (e) {
      console.log(e);
      Notify.failure("Beklenmedik Bir Hatayla Karşılaştık");
      Loading.remove();
      setEmailCheckTemp(false);
      setJobIDCheck(false);
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
      setEmailCheckTemp(false);
      setJobIDCheck(false);
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

  return (
    <div className="locationSearchContainer">
      <div className="locationSearchContent">
        <div className="locationSearchCoordinates">
          {" "}
          <input
            placeholder="Enlem"
            onBlur={(e) => setLat(parseFloat(e.target.value).toFixed(6))}
          />
          <input
            placeholder="Boylam"
            onBlur={(e) => setLng(parseFloat(e.target.value).toFixed(6))}
          />
        </div>
        <div className="locationSearchDetail">
          {" "}
          <input
            placeholder="aramak istediğiniz alan (km2) (Varsayılan 16 Km2)"
            onBlur={(e) => setArea(e.target.value)}
          />
          <input
            placeholder="aramak istediğiniz tür"
            onBlur={(e) => setType(e.target.value)}
          />
        </div>
        <div className="locationSearchButton">
          {" "}
          <button onClick={calculateCoordinate}>Aramayı Tamamla</button>
        </div>
      </div>
    </div>
  );
}

export default LocationSearch;
