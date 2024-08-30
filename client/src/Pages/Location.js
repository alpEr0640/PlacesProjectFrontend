import React, { useState } from "react";
import TextSearch from "../Components/TextSearch";
import LocationSearch from "../Components/LocationSearch";
import SearchTable from "../Components/SearchTable";
import "../CSS/Location.css";
import { useMainContext } from "../MainContext";
export default function Location() {
  const [showTextSearch, setShowTextSearch] = useState(true);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showSearchBody, setShowSearchBody] = useState(true);
  const [activeButton, setActiveButton] = useState("textSearch");
  const {globalSearch} =useMainContext();
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    setShowSearchBody(true);
  };

  return (
    <div className="locationContainer">
      <div className="locationContent">
        <div className="locationContentHeader">
          <button
            className={`locationButton ${activeButton === "textSearch" ? "active" : ""}`}
            onClick={() => handleButtonClick("textSearch")}
          >
            Metinle Arama
          </button>
          <button
            className={`locationButton ${activeButton === "locationSearch" ? "active" : ""}`}
            onClick={() => handleButtonClick("locationSearch")}
          >
            Konumla Arama
          </button>
        </div>
        <div className="locationContentBody">
          <div className="closeSearch">
            {showSearchBody === true ? (
              <i
                className="fa-solid fa-x"
                onClick={() => {
                  setShowLocationSearch(false);
                  setShowTextSearch(false);
                  setShowSearchBody(false);
                  setActiveButton(null);
                }}
              ></i>
            ) : null}
          </div>

          {activeButton === "textSearch" && <TextSearch />}
          {activeButton === "locationSearch" && <LocationSearch />}
            
        </div>
        {globalSearch && <SearchTable/>}
      </div>
      
    </div>
  );
}
