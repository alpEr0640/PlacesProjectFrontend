import React, { useEffect, useState } from "react";
import TextSearch from "../Components/TextSearch";
import LocationSearch from "../Components/LocationSearch";
import SearchTable from "../Components/SearchTable";
import "../CSS/Location.css";
import { useMainContext } from "../MainContext";
import ManuelSearch from "../Components/ManuelSearch";
import LinkSearch from "../Components/LinkSearch";
export default function Location() {
  const [showTextSearch, setShowTextSearch] = useState(true);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showSearchBody, setShowSearchBody] = useState(true);
  const [activeButton, setActiveButton] = useState("textSearch");
  const { globalSearch,setGlobalSearch ,setGlobalAddress} = useMainContext();
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    setShowSearchBody(true);
  };

  

  return (
    <div className="locationContainer">
      <div className="locationContent">
        <div className="locationContentHeader">
          <button
            className={`locationButton ${
              activeButton === "textSearch" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("textSearch")}
          >
            Kolay Arama
          </button>
          <button
            className={`locationButton ${
              activeButton === "locationSearch" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("locationSearch")}
          >
            Koordinatla Arama
          </button>
          <button
            className={`locationButton ${
              activeButton === "linkSearch" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("linkSearch")}
          >
            Linkle Arama
          </button>
          <button
            className={`locationButton ${
              activeButton === "manuelSearch" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("manuelSearch")}
          >
            Manuel Arama
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
          {activeButton=== "manuelSearch"&& <ManuelSearch/>}
          {activeButton=== "linkSearch"&& <LinkSearch/>}
        </div>
        {globalSearch.length > 0 && <SearchTable />}
      </div>
    </div>
  );
}
