import React, { useEffect, useState } from "react";
import "../CSS/ManuelSearch.css";
import axios from "axios";
import { Loading, Notify } from "notiflix";
import { useMainContext } from "../MainContext";
import { useAuth } from "../AuthContext";
import { Block } from "notiflix/build/notiflix-block-aio";
import countries from "../Json/regionCodes.json";
export default function ManuelSearch() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState("");
  const [adress, setAdress] = useState("");
  const apiKey = process.env.REACT_APP_APIKEY;
  const [trigger, setTrigger] = useState(false);
  /* const [tempArray, setTempArray] = useState(""); */

  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [nextPageToken, setNextPageToken] = useState("");
  const {
    setGlobalSearch,
    globalSearch,
    globalAddress,
    setGlobalAddress,
    divide2,
    edge,
    setEdge,
    smallObject,
    divideTrigger,
    setDivideTrigger,
    isSearchContinue,
    setIsSearchContinue,
    dataCount,
    setDataCount,
    divide1,
    divide4,
    middleObject,
  } = useMainContext();
  const { validateToken } = useAuth();
  let tempArray = [];
  let tempLength = 0;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setDivideTrigger(false);
  }, []);

  useEffect(() => {
    if (divideTrigger) {
      const normalArama = async () => {
        try {
          const array = Object.entries(smallObject);
          const rightLat = array[0][1].right[1];
          const rightLng = array[0][1].right[0];
          const leftLat = array[0][1].left[1];
          const leftLng = array[0][1].left[0];
          await checkQuota(parseInt(1));
          await handleTextSearch("", rightLat, rightLng, leftLat, leftLng);
          const Id = await checkEmail(tempArray);
          const root = await scrapStatus(Id);
          const quotaResponse = await decreaseQuota();
          setGlobalSearch((globalSearch) => [...globalSearch, ...root]);

          console.log("global search Uzunluğu:", globalSearch.length);
          Loading.remove();
          if (globalSearch.length === 0) {
            Notify.failure("Veri Bulunamadı");
          }
          tempArray = [];
        } catch (error) {
          Loading.remove();
        }

        setIsSearchContinue(false);
      };
      const ikiyeBol = async () => {
        try {
          for (const index of Object.entries(smallObject)) {
            const rightLat = index[1].right[1];
            const rightLng = index[1].right[0];
            const leftLat = index[1].left[1];
            const leftLng = index[1].left[0];
            await checkQuota(parseInt(2));
            await handleTextSearch("", rightLat, rightLng, leftLat, leftLng);
            const Id = await checkEmail(tempArray);
            const root = await scrapStatus(Id);
            const quotaResponse = await decreaseQuota();
            setGlobalSearch((globalSearch) => [...globalSearch, ...root]);
            tempLength += root.length;
            Loading.remove();
            if (isSearchContinue) {
              Block.dots(
                ".locationContentBody",
                "Lütfen Sayfayı Yenilemeyin Sizin İçin Arama Yapmaya Devam Ediyoruz ",
                {
                  backgroundColor: "#000000cc",
                  cssAnimationDuration: 500,
                  svgColor: "#00b4c4",
                  messageMaxLength: "100",
                  svgSize: "100px",
                  messageFontSize: "15px",
                  messageColor: "#FFF",
                }
              );
            }
            if (globalSearch.length === 0) {
              Notify.failure("Veri Bulunamadı");
            }
            tempArray = [];
          }
          const increment = 2 - Math.ceil(tempLength / 60);
          const increaseResponse = increaseQuota(parseInt(increment));
        } catch (error) {
          Loading.remove();
          Block.remove(".locationContentBody");
        }

        setIsSearchContinue(false);
        Block.remove(".locationContentBody");
      };
      const dordeBol = async () => {
        console.log("3");

        console.log("if kontrol");
        try {
          for (const index of Object.entries(middleObject)) {
            const rightLat = index[1].right[1];
            const rightLng = index[1].right[0];
            const leftLat = index[1].left[1];
            const leftLng = index[1].left[0];
            await checkQuota(parseInt(4));
            await handleTextSearch("", rightLat, rightLng, leftLat, leftLng);
            const Id = await checkEmail(tempArray);
            const root = await scrapStatus(Id);
            const quotaResponse = await decreaseQuota();
            setGlobalSearch((globalSearch) => [...globalSearch, ...root]);
            tempLength += root.length;
            Loading.remove();
            if (isSearchContinue) {
              Block.dots(
                ".locationContentBody",
                "Lütfen Sayfayı Yenilemeyin Sizin İçin Arama Yapmaya Devam Ediyoruz ",
                {
                  backgroundColor: "#000000cc",
                  cssAnimationDuration: 500,
                  svgColor: "#00b4c4",
                  messageMaxLength: "100",
                  svgSize: "100px",
                  messageFontSize: "15px",
                  messageColor: "#FFF",
                }
              );
            }
            if (globalSearch.length === 0) {
              Notify.failure("Veri Bulunamadı");
            }
            tempArray = [];
          }
          const increment = 4 - Math.ceil(tempLength / 60);
          const increaseResponse = increaseQuota(parseInt(increment));
        } catch (error) {
          Loading.remove();
          Block.remove(".locationContentBody");
        }

        setIsSearchContinue(false);
        Block.remove(".locationContentBody");
      };

      if (dataCount === "60") {
        normalArama();
      }
      if (dataCount === "120") {
        ikiyeBol();
      }
      if (dataCount === "240") {
        dordeBol();
      }
    }
    setDivideTrigger(false);
  }, [divideTrigger]);

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
        console.log(data);
        const location = data.results[0].geometry.location;

        return {
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        Loading.remove();
        throw new Error();
      }
    } catch (e) {
      Loading.remove();
      console.log(e);
      throw e;
    }
  };

  const checkQuota = async (count) => {
    const token = window.localStorage.getItem("token");
    //! kota kontrol isteği
    try {
      const checkQuotaRes = await axios.get(
        `${backendurl}home/checkQuota/${count}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (e) {
      if (e.response.status === 429) {
        Notify.failure("Çok Fazla İstek Göndermeye Çalıştınız");
        Loading.remove();
      } else if (e.response.status === 403) {
        if (e.response.data.err) {
          Notify.failure("Kotanız Bulunmamaktadır");
          Loading.remove();
        } else {
          Loading.remove();
        }
      } else if (e.response.status === 402) {
        Notify.failure("Aboneliğiniz Bulunmamaktadır");
        Loading.remove();
      } else {
        Notify.failure("Beklenmedik Bİr Hatayla Karşılaştık");
        Loading.remove();
      }
      throw e;
    }
  };

  const handleTextSearch = async (
    pageToken,
    rightLat,
    rightLng,
    leftLat,
    leftLng
  ) => {
    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          regionCode: "uz",
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

      if (response.data.places) {
        const newPlaces = response.data.places;
        response.data.places.map((index) => {
          tempArray.push(index);
        });
      }

      if (response.data.nextPageToken) {
        console.log("next page geldi");
        await handleTextSearch(
          response.data.nextPageToken,
          rightLat,
          rightLng,
          leftLat,
          leftLng
        );
      } else {
        console.log("next Page gelmedi");
        setNextPageToken("");
      }
    } catch (e) {
      console.log(e);

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

      if (response.data.jobId) {
        return response.data.jobId;
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);

      if (e.response) {
        if (e.response.status === 400) {
          Loading.remove();
        } else if (e.response.status === 403) {
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
      throw e;
    }
  };

  const scrapStatus = async (jobId) => {
    const token = window.localStorage.getItem("token");
    let result = null;
    try {
      do {
        console.log("asdfg");
        const response = await axios.get(
          `${backendurl}home/getScrapStatus/${jobId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.result) {
          result = response.data.result;
          return result;
        }
        await wait(5000);
      } while (!result);
    } catch (e) {
      console.log(e);
      throw e;
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
      return true;
    } catch (e) {
      Loading.remove();
      Notify.failure("Beklenmeyen Bir Hata Oluştu");
      throw e;
    }
  };

  const increaseQuota = async (increment = 0) => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${backendurl}home/increaseQuota`,
        {
          increment: increment,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return true;
    } catch (e) {
      Loading.remove();
      Notify.failure("Beklenmeyen Bir Hata Oluştu");
      throw e;
    }
  };

  useEffect(() => {
    window.localStorage.setItem("mySearch", JSON.stringify(globalSearch));
    window.localStorage.setItem("myAddress", globalAddress);
    console.log("globalSearch", globalSearch);
  }, [globalSearch]);

  const handleButtonClick = async () => {
    tempLength = 0;
    tempArray = [];
    setIsSearchContinue(true);
    setDivideTrigger(false);
    const token = window.localStorage.getItem("token");
    validateToken(token);
    Loading.standard("Sayfayı Yenilemeyin, Sizin İçin Araştırma Yapıyoruz", {
      svgColor: "#00B4C4",
      messageMaxLength: "70",
    });
    setGlobalSearch("");
    try {
      const coordinates = await handleGeocode();
      if (dataCount === "60") divide1(coordinates);
      if (dataCount === "120") divide2(coordinates);
      if (dataCount === "240") divide4(coordinates);
    } catch (error) {
      Notify.failure("Adres Bulunamadı");
    }
  };
  useEffect(() => {
    console.log(country);
  }, [country]);
  return (
    <div className="manuelSearchContainer">
      <div className="manuelSearchContent" id="test">
        <div className="manuelSearchCoordinates">
          <select
            onChange={(e) => setCountry(e.target.selectedOptions[0].text)}
          >
            <option value={""}>-Ülke Seçin-</option>
            {countries.map((index, key) => (
              <option key={key} value={index.kod}>
                {index.Ülkeler}
              </option>
            ))}
          </select>
          <input placeholder="Adres" onBlur={(e) => setCity(e.target.value)} />
        </div>
        <div className="manuelSearchDetail">
          {" "}
          <select onChange={(e) => setDataCount(e.target.value)}>
            <option value={60}>-Getirilecek Veri Sayısı-</option>
            <option value={60}>60</option>
            <option value={120}>120</option>
            <option value={240}>240</option>
          </select>
          <input
            placeholder="Aranacak Alan Km2"
            onBlur={(e) => {
              if (!isNaN(e.target.value)) setEdge(Math.sqrt(e.target.value));
            }}
          />
        </div>
        <div className="manuelSearchButton">
          <input
            className="locationSearchDetail"
            placeholder="Aramak İstediğiniz Tür"
            onBlur={(e) => setType(e.target.value)}
          />{" "}
          <button onClick={handleButtonClick}>Aramayı Tamamla</button>
        </div>
      </div>
    </div>
  );
}
