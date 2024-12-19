import React, { useState } from "react";
import "../CSS/FormPages/FormPage.css";
import DataSupply from "../Components/FormPages/DataSupply";
import FormAnalysis from "../Components/FormPages/FormAnalysis";
import SalesForm from "../Components/FormPages/SalesForm";
import FormFooter from "../Components/FormPages/FormFooter";

import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
export default function FormPage() {
  const [activeFormButton, setActiveFormButton] = useState("destek");
  const captchaKey = process.env.REACT_APP_CAPTCHAKEY;
  const handleButtonClick = (buttonType) => {
    setActiveFormButton(buttonType);
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
      <div className="FormContainer">
        <div className="FormContainerHeader">
          <h1>Sector Scout </h1>
        </div>
        <div className="FormContent">
          <div className={`formContentButtons`}>
            <button
              className={` ${
                activeFormButton === "destek" ? "formActive" : ""
              }`}
              onClick={() => handleButtonClick("destek")}
            >
              {" "}
              Satış Ve Tedarik Destek Formu
            </button>
            <button
              className={` ${activeFormButton === "rapor" ? "formActive" : ""}`}
              onClick={() => handleButtonClick("rapor")}
            >
              {" "}
              Veri Tedariği Ve Analiz Rapor Paylaşımı
            </button>
            <button
              className={` ${
                activeFormButton === "tedarik" ? "formActive" : ""
              }`}
              onClick={() => handleButtonClick("tedarik")}
            >
              {" "}
              Veri Tedariği
            </button>
          </div>
          <div className="FormContentForms">
            {activeFormButton === "tedarik" && <DataSupply />}
            {activeFormButton === "rapor" && <FormAnalysis />}
            {activeFormButton === "destek" && <SalesForm />}
          </div>
          <div className="formImages">
            <div className="coverImage img1">
              <label for="belge">İhtiyacınıza göre bu formu doldurun</label>
            </div>
            <div className="coverImage img2">
              <label for="anlasma"> İstek ve ihtiyaçlarınızı inceleyelim</label>
            </div>
            <div className="coverImage img3">
              <label for="mesaj">Tarafınıza geri dönüş yapalım </label>
            </div>
            <div className="coverImage img4">
              <label for="mesaj">Anlaşma sağlayalım</label>
            </div>
          </div>
        </div>
        <div className="formFooter">
          <FormFooter />
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
}
