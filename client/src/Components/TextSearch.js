import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/TextSearch.css";
import { useMainContext } from "../MainContext";
import { Loading, Notify } from "notiflix";
import { useAuth } from "../AuthContext";
const TextSearch = () => {
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState("");
  const [detail, setDetail] = useState("");
  const [payload, setPayload] = useState("");
  const [locationX, setLocationX] = useState(null);
  const [locationY, setLocationY] = useState(null);
  const [type, setType] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");
  const { setGlobalSearch, globalSearch, globalAddress, setGlobalAddress } =
    useMainContext();
  const [tempArray, setTempArray] = useState("");
  const [temp, setTemp] = useState(false);
  const apiKey = process.env.REACT_APP_APIKEY;
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const { validateToken } = useAuth();
  const [emailCheckTemp, setEmailCheckTemp] = useState(false);
  const [jobID, setJobID] = useState("0");
  const [jobIDCheck, setJobIDCheck] = useState(false);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("https://turkiyeapi.dev/api/v1/provinces");
        const cityNames = res.data.data.map((type) => type.name);
        setCity(cityNames);
      } catch (e) {
        Loading.remove();
        console.log(e);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `https://turkiyeapi.dev/api/v1/provinces?name=${selectedCity}`
        );
        console.log();
        const districts = response.data.data[0].districts;
        setState(districts);
      } catch (e) {
        Loading.remove();
        console.log(e);
      }
    };

    if (selectedCity) fetchStates();
  }, [selectedCity]);

  useEffect(() => {
    if (selectedState) {
      const fetchStreet = async () => {
        try {
          const response = await axios.get(
            `https://turkiyeapi.dev/api/v1/districts/${selectedState}`
          );
          setNeighborhoods(response.data.data.neighborhoods);
        } catch (e) {
          Loading.remove();
          console.log(e);
        }
      };
      fetchStreet();
    }
  }, [selectedState]);

  useEffect(() => {
    if (locationX !== null && locationY !== null) {
      checkQuota();
    }
  }, [locationX, locationY, trigger]);

  const HandleGeocode = async () => {
    const fullAddress =
      selectedCity +
      " " +
      selectedStateName +
      " " +
      selectedNeighborhoods +
      " " +
      detail;
    setGlobalAddress(fullAddress + ", " + type);
    setPayload(fullAddress);

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${apiKey}`
      );

      const data = response.data;
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;

        setLocationX(location.lat);
        setLocationY(location.lng);
      } else {
        Notify.failure("Adres Bulunamadı");
        Loading.remove();
        throw new Error();
      }
    } catch (e) {
      Loading.remove();
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
      console.log(e.response.status);
      if (e.response.status === 429) {
        Notify.failure("İstek Limitini Aştınız");
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
        Loading.remove();
        Notify.failure("Beklenmedik Bir Hatayla Karşılaştık");
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
              "places.displayName,places.formattedAddress,nextPageToken,places.websiteUri,places.internationalPhoneNumber",
          },
        }
      );

      if (response.data.places) {
        const newPlaces = response.data.places;
        setTempArray((tempArray) => [...tempArray, ...newPlaces]);
        setGlobalSearch("");
        setEmailCheckTemp(false);
        setJobIDCheck(false)
      } else {
        Notify.failure("Sonuç Bulunamadı");
        Loading.remove();
      }

      if (response.data.nextPageToken) {
        handleTextSearch((pageToken = response.data.nextPageToken));
      } else {
        setNextPageToken("");
        if (response.status === 200) {
          setEmailCheckTemp(true);
          setJobIDCheck(true);
        }
      }
    } catch (e) {
      setEmailCheckTemp(false);
      setJobIDCheck(false);
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
        setJobIDCheck(true);
      }
    } catch (e) {
      setEmailCheckTemp(false);
      setJobIDCheck(false);
      if (e.response) {
        if (e.response.status === 403) {
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
      if (response.data.finishedAt) {
        setTempArray(response.data.result); //responseyi kontrol et oraya dizi göndermen gerekiyor
        decreaseQuota();
      } else {
        setTimeout(() => scrapStatus(jobId), 5000);
      }
    } catch (e) {
      setEmailCheckTemp(false);
      setJobIDCheck(false);
      console.log(e);
      Loading.remove();
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
      setEmailCheckTemp(false);
      setJobIDCheck(false);
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
    /* if (checkQueryState === false) {
      checkQuery();
    } else {
      
    } */
    Loading.standard("Sayfayı Yenilemeyin, Sizin İçin Araştırma Yapıyoruz", {
      svgColor: "#00B4C4",
      messageMaxLength: "70",
    });
    await HandleGeocode();
    setTrigger((prev) => !prev);
  };

  return (
    <div className="textSearchContainer">
      <div className="textSearchContent">
        <div className="selectContent">
          <select
            onChange={(e) => {
              setSelectedCity(e.target.value);
              if (selectedCity) {
                setSelectedNeighborhoods("");
                setSelectedState("");
                setSelectedStateName("");
              }
            }}
          >
            <option value="">Şehirler</option>
            {city.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {selectedCity && (
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                const selected = state.find(
                  (type) => type.id === Number(e.target.value)
                );

                if (selected) {
                  setSelectedStateName(selected.name);
                } else {
                  setSelectedStateName("");
                }
              }}
            >
              <option value="">İlçeler</option>
              {state.map((type, index) => (
                <option key={index} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          )}

          {selectedState && selectedCity && (
            <select
              value={selectedNeighborhoods}
              onChange={(e) => setSelectedNeighborhoods(e.target.value)}
            >
              <option value="">Mahalle</option>
              {neighborhoods.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          )}
          {selectedNeighborhoods && selectedState && selectedCity && (
            <input
              placeholder="Sokak"
              onBlur={(e) => setDetail(e.target.value)}
            />
          )}
        </div>

        <div className="deneme">
          <div className="textSearchType">
            <input
              placeholder="aramak istediğiniz tür"
              required
              onBlur={(e) => setType(e.target.value)}
            />
          </div>
          <div className="searchButton">
            <button onClick={handleButtonClick}>Aramayı Tamamla</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSearch;
