import axios from "axios";
import { Loading, Notify } from "notiflix";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function FormAnalysis() {
  const [dataType, setDataType] = useState("");
  const [dataCount, setDataCount] = useState("");
  const [dataCountry, setDataCountry] = useState("");
  const [dataName, setDataName] = useState("");
  const [dataMail, setDataMail] = useState("");
  const [dataPhoneNum, setDataPhoneNum] = useState("");
  const [dataAnalysis, setDataAnalysis] = useState("");
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmitForm = async () => {
    Loading.standard({ svgColor: "#00B4C4" });
    if (!executeRecaptcha) {
      console.log("reCAPTCHA is not ready yet.");
      return;
    }

    // Generate reCAPTCHA token
    const captchaToken = await executeRecaptcha("submit");

    try {
      const response = await axios.post(
        `${backendurl}form/save`,
        {
          option: "0",
          formType: "analiz",
          contact: {
            name: dataName,
            email: dataMail,
            phone: dataPhoneNum,
          },
          additionalFields: {
            dataType: dataType,
            dataCount: dataCount,
            dataSource: dataCountry,
            analysis: dataAnalysis,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            CaptchaResponse: captchaToken,
          },
        }
      );

      Loading.remove();
    } catch (error) {
      if (error.response?.status === 400) {
        Loading.remove();
        Notify.failure("Gerekli Alanları Doldurun");
      } else if (error.response?.status === 403) {
        Notify.failure("Şüpheli Aktivite. Bizimle İletişime geçin");
        Loading.remove();
      } else {
        Loading.remove();
        Notify.failure("Server Hatası");
      }
    }
  };

  return (
    <div className="datasupplyForm animated-entry">
      <div className="dataSupplyFormHeader">
        <h1> Veri Tedariği ve Analiz Raporu</h1>
      </div>
      <form
        className="dataSupplyFormBody"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm();
        }}
      >
        <div className="dataInputs">
          <label htmlFor="dataType">Veri Türü</label>
          <input
            maxlength="100"
            type="text"
            name="dataType"
            onBlur={(e) => {
              setDataType(e.target.value);
            }}
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="dataCount">Veri Sayısı:</label>
          <input
            max={"10000"}
            min={"1"}
            maxlength="5"
            type="number"
            name="dataCount"
            onBlur={(e) => {
              setDataCount(e.target.value);
            }}
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="country">Ülke/Şehir:</label>
          <input
            maxlength="50"
            type="text"
            name="Country"
            onBlur={(e) => {
              setDataCountry(e.target.value);
            }}
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="analysis">Analiz Raporu Detaylı Bilgi</label>
          <textarea
            maxlength="1000"
            type="text"
            name="analysis"
            onBlur={(e) => {
              setDataAnalysis(e.target.value);
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="name">Adınız:</label>
          <input
            maxlength="70"
            type="text"
            name="name"
            onBlur={(e) => {
              setDataName(e.target.value);
            }}
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="email">Email:</label>
          <input
            maxlength="100"
            type="email"
            name="email"
            onBlur={(e) => {
              setDataMail(e.target.value);
            }}
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="number">Telefon Numarası:</label>
          <input
            minLength="11"
            maxlength="20"
            type="number"
            name="number"
            onBlur={(e) => {
              setDataPhoneNum(e.target.value);
            }}
          />
        </div>
        <div className="formButton">
          <button> Onayla ve Gönder </button>
        </div>
      </form>
    </div>
  );
}
