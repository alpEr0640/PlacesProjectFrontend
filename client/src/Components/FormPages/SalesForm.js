import axios from "axios";
import { Loading, Notify } from "notiflix";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Tooltip from "../../Animation/Tooltip";
import "../../CSS/Animation/Tooltip.css";

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
  const [file, setFile] = useState("");
  const [sellOrBuyPlace, setSellOrBuyPlace] = useState("");
  const [companyName, setCompanyName] = useState("");
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
    const formdata = new FormData();
    formdata.append("option", "1");
    formdata.append("formType", dataType);
    formdata.append("additionalFields[product]", product);
    formdata.append("additionalFields[price]", dataPrice);
    formdata.append("additionalFields[currency]", currency);
    formdata.append("additionalFields[details]", dataDetail);
    formdata.append("additionalFields[sellOrBuyPlace]", sellOrBuyPlace);
    formdata.append("contact[name]", dataName);
    formdata.append("contact[email]", dataMail);
    formdata.append("contact[phone]", dataPhoneNum);
    formdata.append("contact[companyName]", companyName);

    if (file) {
      formdata.append("file", file);
    }
    formdata.forEach((value, key) => {
      console.log(key, value);
    });
    try {
      const response = await axios.post(`${backendurl}form/save`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          CaptchaResponse: captchaToken,
        },
      });
      Loading.remove();
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
        <h1> Satış Ve Tedarik Destek Formu</h1>
      </div>
      <form
        className="dataSupplyFormBody"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm();
        }}
      >
        <div className="dataInputs">
          <label htmlFor="sales">
            Satış/Tedarik{" "}
            <Tooltip
              text={
                "Satış mı yapmak istiyorsunuz? Ürün mü tedarik etmek istiyorsunuz?"
              }
            >
              {" "}
              <span className="material-symbols-outlined">info</span>
            </Tooltip>
          </label>
          <select
            name="sales"
            onChange={(e) => {
              setDataType(e.target.value);
            }}
            required
          >
            {" "}
            <option value={""}>--Seçiniz--</option>
            <option value={"satış"}>Ürün Satışı yapmak istiyorum</option>
            <option value={"tedarik"}>Ürün tedarik etmek istiyorum</option>
          </select>
        </div>
        <div className="dataInputs">
          <label htmlFor="product">Lütfen ilgili ürünü belirtiniz: </label>
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
          <label htmlFor="sellOrBuyPlaces">
            {dataType === "tedarik"
              ? "İlgili ürün nerelerden tedarik edilir belirtiniz:"
              : "İlgili ürün nerelere satılır belirtiniz:"}{" "}
          </label>
          <input
            type="text"
            min={"2"}
            maxlength="100"
            name="sellOrBuyPlaces"
            onBlur={(e) => {
              setSellOrBuyPlace(e.target.value);
            }}
            required
          />
        </div>

        <div className="dataInputs">
          <label htmlFor="price">
            Fiyat:{" "}
            <Tooltip
              text={
                dataType === "tedarik"
                  ? "Ürünü kaça tedarik etmeyi düşünüyorsunuz?"
                  : "Ürünü kaça satmayı düşünüyorsunuz "
              }
            >
              {" "}
              <span className="material-symbols-outlined">info</span>
            </Tooltip>
          </label>
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
          <select
            name="currency"
            onChange={(e) => {
              setCurrency(e.target.value);
            }}
            required
          >
            {" "}
            <option value={""}>--Seçiniz--</option>
            <option value={"TRY"}>Türk Lirası (TRY)</option>
            <option value={"USD"}>Amerikan Doları (USD)</option>
            <option value={"EUR"}>Euro (EUR)</option>
            <option value={"GBP"}>İngiliz Sterlini (GBP)</option>
            <option value={"JPY"}>Japon Yeni (JPY) </option>
            <option value={"CNY"}>Çin Yuanı (CNY) </option>
            <option value={"RUB"}>Rus Rublesi (RUB) </option>
          </select>
        </div>
        <div className="dataInputs">
          <label htmlFor="detail">
            Detay:{" "}
            <Tooltip
              text={
                "Lütfen konuyu iyi anlamamız için daha detaylı bilgiler veriniz ayrıca satış ve tedarik konusunda istediğiniz ülke şehir ilçe vb. varsa lütfen bu kısımda belirtiniz"
              }
            >
              {" "}
              <span className="material-symbols-outlined">info</span>
            </Tooltip>
          </label>
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
          <label htmlFor="image">Resim:</label>
          <input
            maxlength="70"
            type="file"
            name="image"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
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
          <label htmlFor="Firma Adı">Firma Adı:</label>
          <input
            maxlength="70"
            type="text"
            name="Firma Adı"
            onBlur={(e) => {
              setCompanyName(e.target.value);
            }}
          />
        </div>
        <div className="dataInputs">
          <label htmlFor="email">Mail:</label>
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
