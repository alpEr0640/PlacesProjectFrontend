import React, { useEffect, useState } from "react";
import "../CSS/LinkSearch.css";
import { Loading, Notify } from "notiflix";
import axios from "axios";
import { useMainContext } from "../MainContext";
export default function LinkSearch() {
  const [url, setUrl] = useState("");
  const latDegree = 111.32;
  const [type, setType] = useState("");
  const [distance, setDistance] = useState("");
  const [leftLat, setLeftLat] = useState(null);
  const [leftLng, setLeftLng] = useState(null);
  const [rightLat, setRightLat] = useState(null);
  const [rightLng, setRightLng] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [tempArray, setTempArray] = useState("");
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const apiKey = process.env.REACT_APP_APIKEY;
  const [nextPageToken, setNextPageToken] = useState("");
  const [jobID, setJobID] = useState("0");
  const { setGlobalSearch, globalSearch, setGlobalAddress, globalAddress } =
    useMainContext();
  const [temp, setTemp] = useState(false);
  const [emailCheckTemp, setEmailCheckTemp] = useState(false);
  const [jobIDCheck, setJobIDCheck] = useState(false);

  const handleClick = (url) => {
    //arama tipini bulmak için
    const searchTermMatch = url.match(/\/search\/(.*?)\//);
    const searchTerm = searchTermMatch
      ? decodeURIComponent(searchTermMatch[1])
      : null;
    setType(searchTerm);

    //lat lng bulmak için
    const coordsMatch = url.match(/@(-?\d+.\d+),(-?\d+.\d+)/);
    const latitude = coordsMatch ? parseFloat(coordsMatch[1]) : null;
    const longitude = coordsMatch ? parseFloat(coordsMatch[2]) : null;
    //zoom değerini bulmak için
    const zoomMatch = url.match(/,(\d+(\.\d+)?)z/);
    const zoom = zoomMatch ? parseFloat(zoomMatch[1]) : null;
    //calculate zoom to km
    const C = 40075016;
    const fullAdress =
      latitude + ", " + longitude + ", " + zoom + ", " + searchTerm;
    setGlobalAddress(fullAdress);
    const width =
      (38000 / Math.pow(2, zoom - 3)) * Math.cos((latitude * Math.PI) / 180);
    calculateCoordinate(latitude, longitude, width);
  };

  const calculateCoordinate = (lat, lng, area) => {
    Loading.standard("Sayfayı Yenilemeyin, Sizin İçin Araştırma Yapıyoruz", {
      svgColor: "#00B4C4",
      messageMaxLength: "70",
    });
    const num = parseFloat(area);

    const calculatedDistance = num / 2;
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
        window.localStorage.removeItem("mySearch");
        window.localStorage.removeItem("myAddress");
        setEmailCheckTemp(false);
        setJobIDCheck(false);
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
      Loading.remove();
      Notify.failure("Yanlış Link");
      console.error("Error fetching places:", error);
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
          timeout: 300000,
        }
      );

      if (response.status === 200) {
        setJobID(response.data.jobId);
      }
    } catch (e) {
      setEmailCheckTemp(false);
      setJobIDCheck(false);
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
        setTempArray(response.data.result);
        decreaseQuota();
      }
    } catch (e) {
      console.log(e);
      Notify.failure("Beklenmedik Bir Hatayla Karşılaştık")
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
    <div className="linkSearchContainer">
      <div className="linkSearchContent">
        <input
          placeholder="link"
          onBlur={(e) => {
            setUrl(e.target.value);
          }}
        />
      </div>
      <div className="linkSearchButton">
        <button onClick={() => handleClick(url)}>Aramayı Tamamla</button>
      </div>
    </div>
  );
}
