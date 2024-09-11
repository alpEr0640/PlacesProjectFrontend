import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/TextSearch.css";
import { useMainContext } from "../MainContext";
import { Notify } from "notiflix";

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
  const { setGlobalSearch, globalSearch } = useMainContext();
  const apiKey = process.env.REACT_APP_APIKEY;

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("https://turkiyeapi.dev/api/v1/provinces");
        const cityNames = res.data.data.map((type) => type.name);
        setCity(cityNames);
      } catch (e) {
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
          console.log(e);
        }
      };
      fetchStreet();
    }
  }, [selectedState]);

  useEffect(() => {
    if (locationX !== null && locationY !== null) {
      handleTextSearch();
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

    setPayload(fullAddress);
    console.log(fullAddress);
    console.log(selectedState);
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
        console.log(locationX, " ", locationY);
        /* setTrigger(prev => !prev);  */
      } else {
        alert("Adres bulunamadı.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleTextSearch = async (pageToken = "") => {
    console.log(locationX, " ", locationY);
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
              "places.displayName,places.formattedAddress,places.priceLevel,nextPageToken",
          },
        }
      );
      console.log(response.data)
      if(response.data.places){
        const newPlaces = response.data.places;
        setGlobalSearch((globalSearch) => [...globalSearch, ...newPlaces]);
      }
      else{
        Notify.failure('Sonuç Bulunamadı');
      }
  
      if (response.data.nextPageToken) {
        handleTextSearch((pageToken = response.data.nextPageToken));
      } else {
        setNextPageToken("");
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    console.log(globalSearch);
  }, [globalSearch]);
  const handleButtonClick = async () => {
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
            <button onClick={handleButtonClick}>Metinle Arama</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSearch;
