import React, { useEffect, useState } from "react";
import "../CSS/ManuelSearch.css";
import axios from "axios";
import { Loading, Notify } from "notiflix";
import { useMainContext } from "../MainContext";
import { useAuth } from "../AuthContext";
import { Block } from "notiflix/build/notiflix-block-aio";
import countries from "../Json/regionCodes.json";
import { jwtDecode } from "jwt-decode";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
export default function ManuelSearch() {
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [adress, setAdress] = useState("");
  const apiKey = process.env.REACT_APP_APIKEY;
  const translateApi = process.env.REACT_APP_TRANSLATEAPIKEY;
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
  const [regionCode, setRegionCode] = useState("");
  const [selectedTranslate, setSelectedTranslate] = useState("mainLanguage");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [subInfo, setSubInfo] = useState("lite");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setDivideTrigger(false);
    const token = window.localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setSubInfo(decodedToken.subPlan);
  }, []);
  const renderDatas = () => {
    console.log(subInfo);
    switch (subInfo) {
      case "Lite":
        return (
          <select onChange={(e) => setDataCount(e.target.value)}>
            <option value={60}>-Getirilecek Veri Sayısı-</option>
            <option value={60}>60</option>
          </select>
        );
      case "Standard":
        return (
          <select onChange={(e) => setDataCount(e.target.value)}>
            <option value={60}>-Getirilecek Veri Sayısı-</option>
            <option value={60}>60</option>
            <option value={120}>120</option>
          </select>
        );
      case "Premium":
        return (
          <select onChange={(e) => setDataCount(e.target.value)}>
            <option value={60}>-Getirilecek Veri Sayısı-</option>
            <option value={60}>60</option>
            <option value={120}>120</option>
            <option value={240}>240</option>
          </select>
        );
      default:
        return (
          <select onChange={(e) => setDataCount(e.target.value)}>
            <option value={60}>-Getirilecek Veri Sayısı-</option>
          </select>
        );
    }
  };
  useEffect(() => {
    if (divideTrigger) {
      const normalArama = async () => {
        try {
          const translateResponse = await translate();
          const array = Object.entries(smallObject);
          const rightLat = array[0][1].right[1];
          const rightLng = array[0][1].right[0];
          const leftLat = array[0][1].left[1];
          const leftLng = array[0][1].left[0];
          await checkQuota(parseInt(1));
          await handleTextSearch(
            "",
            rightLat,
            rightLng,
            leftLat,
            leftLng,
            translateResponse
          );
          const Id = await checkEmail(tempArray);
          const root = await scrapStatus(Id);
          const quotaResponse = await decreaseQuota();
          setGlobalSearch((globalSearch) => [...globalSearch, ...root]);
          tempLength += root.length;
          console.log("global search Uzunluğu:", globalSearch.length);
          Loading.remove();
          if (tempLength === 0) {
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
          const translateResponse = await translate();
          console.log("asdf", translateResponse);
          await checkQuota(parseInt(2));
          for (const index of Object.entries(smallObject)) {
            const rightLat = index[1].right[1];
            const rightLng = index[1].right[0];
            const leftLat = index[1].left[1];
            const leftLng = index[1].left[0];

            await handleTextSearch(
              "",
              rightLat,
              rightLng,
              leftLat,
              leftLng,
              translateResponse
            );
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
            if (tempLength.length === 0) {
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
        try {
          const translateResponse = await translate();
          await checkQuota(parseInt(4));
          for (const index of Object.entries(middleObject)) {
            const rightLat = index[1].right[1];
            const rightLng = index[1].right[0];
            const leftLat = index[1].left[1];
            const leftLng = index[1].left[0];

            await handleTextSearch(
              "",
              rightLat,
              rightLng,
              leftLat,
              leftLng,
              translateResponse
            );
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
            if (tempLength.length === 0) {
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
    const fullAdress = country + " " + adress;
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
      Notify.failure("Adres Bulunamadı");
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
    leftLng,
    translateResponse
  ) => {
    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          regionCode: regionCode,
          languageCode: "tr",
          textQuery: translateResponse,
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
              "places.displayName,places.formattedAddress,nextPageToken,places.websiteUri,places.internationalPhoneNumber,places.rating,places.googleMapsUri",
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
        await handleTextSearch(
          response.data.nextPageToken,
          rightLat,
          rightLng,
          leftLat,
          leftLng,
          translateResponse
        );
      } else {
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

  const increaseQuota = async (increment = parseInt(0)) => {
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

  const translate = async () => {
    const target = selectedTranslate === "mainLanguage" ? targetLanguage : "en";
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${translateApi}&q=${type}&target=${target}&type=text`
      );
      console.log(
        "Çevrilen Kelime",
        response.data.data.translations[0].translatedText
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    window.localStorage.setItem("mySearch", JSON.stringify(globalSearch));
    window.localStorage.setItem("myAddress", globalAddress);
  }, [globalSearch]);

  const handleButtonClick = async () => {
    const hak = parseInt(dataCount / 60);
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
      console.log(error);
    }
  };

  return (
    <div className="manuelSearchContainer">
      <div className="manuelSearchContent" id="test">
        <div className="manuelSearchCoordinates">
          <select
            onChange={(e) => {
              setRegionCode(e.target.value);
              setCountry(e.target.selectedOptions[0].text);
              setTargetLanguage(e.target.selectedOptions[0].title);
            }}
          >
            <option value={""}>-Ülke Seçin-</option>
            {countries.map((index, key) => (
              <option key={key} value={index.kod} title={index.dilKodu}>
                {index.Ülkeler}
              </option>
            ))}
          </select>
          <input
            placeholder="Adres"
            onBlur={(e) => setAdress(e.target.value)}
          />
        </div>
        <div className="manuelSearchDetail">
          {" "}
          {renderDatas()}
          <input
            placeholder="Aranacak Alan Km2"
            onBlur={(e) => {
              if (!isNaN(e.target.value)) setEdge(Math.sqrt(e.target.value));
            }}
          />
        </div>
        <div className="manuelSearchButton">
          <input
            className="manuelSearchType"
            placeholder="Aramak İstediğiniz Tür"
            onBlur={(e) => setType(e.target.value)}
          />
          <form>
            <label>
              <input
                type="radio"
                value="mainLanguage"
                onClick={(e) => {
                  setSelectedTranslate(e.target.value);
                  console.log(selectedTranslate);
                }}
                checked={selectedTranslate === "mainLanguage"}
              />
              Resmi Dilde Ara
            </label>
            <label>
              <input
                type="radio"
                value="toEnglish"
                onClick={(e) => {
                  setSelectedTranslate(e.target.value);
                  console.log(selectedTranslate);
                }}
                checked={selectedTranslate === "toEnglish"}
              />
              İngilizce Ara
            </label>
          </form>{" "}
        </div>
        <div className="manuelSearchComplete">
          <button onClick={handleButtonClick}>Aramayı Tamamla</button>
          <div
            className="popup"
            onMouseEnter={() => {
              var popup = document.getElementById("myPopup");
              popup.classList.toggle("show");
            }}
          >
            <i class="fa-solid fa-circle-info"></i>{" "}
            <span class="popuptext" id="myPopup">
              Her Bir Arama Hakkı maksimum 60 veri getirir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
