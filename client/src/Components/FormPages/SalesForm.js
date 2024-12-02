import axios from "axios";
import { Loading, Notify } from "notiflix";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function SalesForm() {
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [dataType, setDataType] = useState("");
  const [product, setProduct] = useState("");
  const [dataPrice, setDataPrice] = useState("");
  const [dataDetail, setDataDetail] = useState("");
  const [dataName, setDataName] = useState("");
  const [dataMail, setDataMail] = useState("");
  const [currency, setCurrency] = useState("");
  const [dataPhoneNum, setDataPhoneNum] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  function limitDecimalPlaces(event) {
    const input = event.target;
    console.log(input);
    // Maksimum 2 ondalık basamak izin ver
    const value = input.value;
    const decimalIndex = value.indexOf(".");

    if (decimalIndex !== -1 && value.length - decimalIndex > 3) {
      input.value = value.slice(0, decimalIndex + 3);
    }
  }

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
          option: "1",
          formType: dataType,
          contact: {
            name: dataName,
            email: dataMail,
            phone: dataPhoneNum,
          },
          additionalFields: {
            product: product,
            price: dataPrice,
            currency: currency,
            details: dataDetail,
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
          <label htmlFor="sales">Satış/Tedarik</label>
          <select
            name="sales"
            onChange={(e) => {
              setDataType(e.target.value);
            }}
            required
          >
            {" "}
            <option value={""}>--Seçiniz--</option>
            <option value={"satış"}>Satış Destek</option>
            <option value={"tedarik"}>Veri Tedariği</option>
          </select>
        </div>
        <div className="dataInputs">
          <label htmlFor="product">Ürün:</label>
          <input
            type="text"
            min={"2"}
            maxlength="100"
            name="product"
            onBlur={(e) => {
              setProduct(e.target.value.replace(",", "."));
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="price">Fiyat:</label>
          <input
            max={"1000000000"}
            min={"1"}
            name="price"
            step="0.01"
            oninput={(event) => {
              limitDecimalPlaces(event);
            }}
            type="number"
            onBlur={(e) => {
              setDataPrice(e.target.value);
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="currency">Para Birimi:</label>
          <input
            maxlength="25"
            type="text"
            name="currency"
            onBlur={(e) => {
              setCurrency(e.target.value);
            }}
            required
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="detail">Detay:</label>
          <textarea
            maxlength="1000"
            type="text"
            name="detail"
            onBlur={(e) => {
              setDataDetail(e.target.value);
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
            required
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
