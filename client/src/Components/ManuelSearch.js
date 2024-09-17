import React, { useEffect, useState } from "react";
import "../CSS/ManuelSearch.css";
import axios from "axios";
import { Loading, Notify } from "notiflix";
import { useMainContext } from "../MainContext";

export default function ManuelSearch() {
  const [country, setCountry] = useState("Türkiye");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [adress, setAdress] = useState("");
  const [type, setType] = useState("");
  const [locationX, setLocationX] = useState(null);
  const [locationY, setLocationY] = useState(null);
  const [tempArray, setTempArray] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [temp, setTemp] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const { setGlobalSearch, globalSearch } = useMainContext();
  const apiKey = process.env.REACT_APP_APIKEY;
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    if (locationX !== null && locationY !== null) {
      checkQuota();
    }
  }, [locationX, locationY, trigger]);
  const handleGeocode = async () => {
    const fullAdress = country + " " + city + " " + state + " " + adress;
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
        console.log(locationX, " ", locationY);
        /* setTrigger(prev => !prev);  */
      } else {
        alert("Adres bulunamadı.");
      }
    } catch (e) {
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
      console.log("kota kontrol: ", checkQuotaRes.data.result);
      if (checkQuotaRes.data.result === true) {
        handleTextSearch();
      }
    } catch (e) {
      Notify.failure("Kotanız Bulunmamaktadır");
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
              "places.displayName,places.formattedAddress,places.priceLevel,nextPageToken",
          },
        }
      );
      console.log("status kontrol: ", response.status);
      if (response.data.places) {
        const newPlaces = response.data.places;
        setTempArray((tempArray) => [...tempArray, ...newPlaces]);
      } else {
        Notify.failure("Sonuç Bulunamadı");
      }

      if (response.data.nextPageToken) {
        handleTextSearch((pageToken = response.data.nextPageToken));
      } else {
        setNextPageToken("");
        if (response.status === 200) {
          decreaseQuota();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const decreaseQuota = async () => {
    const token = window.localStorage.getItem("token");
    try {
      console.log(token);
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
      console.log("kota azaltma", decreaseQuotaRes);
    } catch (e) {
      Notify.failure("Beklenmeyen Bir Hata Oluştu");
    }
  };

  useEffect(() => {
    setGlobalSearch((globalSearch) => [...globalSearch, ...tempArray]);
    Loading.remove();
    setTempArray("");
  }, [temp]);

  const handleButtonClick = async () => {
    Loading.standard({svgColor:"#00B4C4"})
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
