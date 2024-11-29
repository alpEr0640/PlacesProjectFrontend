import React, { useState } from "react";
import { Form } from "react-router-dom";
import "../../CSS/FormPages/DataSupply.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { Loading, Notify } from "notiflix";
export default function DataSupply() {
  const [dataType, setDataType] = useState("");
  const [dataCount, setDataCount] = useState("");
  const [dataCountry, setDataCountry] = useState("");
  const [dataName, setDataName] = useState("");
  const [dataMail, setDataMail] = useState("");
  const [dataPhoneNum, setDataPhoneNum] = useState("");
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
          formType: "veri desteği",
          contact: {
            name: dataName,
            email: dataMail,
            phone: dataPhoneNum,
          },
          additionalFields: {
            dataType: dataType,
            dataCount: dataCount,
            dataSource: dataCountry,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            CaptchaResponse: captchaToken,
          },
        }
      );
      Notify.success(
        "Form Başarıyla Kaydedildi. En Kısa sürede Tarafınıza Dönüş yapılacaktır"
      );
      Loading.remove();
      console.log(response);
    } catch (error) {
      console.log(error);
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
        <h1> Veri Tedariği</h1>
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
            autoComplete="off"
            name="dataType"
            onBlur={(e) => {
              setDataType(e.target.value);
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="dataCount">Veri Sayısı:</label>
          <input
            max={"10000"}
            min={"1"}
            maxlength="5"
            name="dataCount"
            autoComplete="off"
            onBlur={(e) => {
              setDataCount(e.target.value);
            }}
            type="number"
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="country">Ülke/Şehir:</label>
          <input
            maxlength="50"
            type="text"
            name="Country"
            autoComplete="off"
            onChange={(e) => {
              setDataCountry(e.target.value);
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
            autoComplete="off"
            onChange={(e) => {
              setDataName(e.target.value);
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="email">Email:</label>
          <input
            maxlength="100"
            type="email"
            autoComplete="off"
            name="email"
            onBlur={(e) => {
              setDataMail(e.target.value);
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="number">Telefon Numarası:</label>
          <input
            minLength="11"
            maxlength="20"
            type="number"
            name="number"
            autoComplete="off"
            onChange={(e) => {
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
