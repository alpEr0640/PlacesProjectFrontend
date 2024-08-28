import axios from "axios";
import React, { useEffect, useState } from "react";
import "../CSS/LocationSearch.css"
function LocationSearch() {
  const [lng, setLng] = useState(null); //!sola sağa giderken değişiyor
  const [lat, setLat] = useState(null); //! aşağı yukarı giderken değişiyor
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [distance, setDistance] = useState("");
  const [leftLat, setLeftLat] = useState(null);
  const [leftLng, setLeftLng] = useState(null);
  const [rightLat, setRightLat] = useState(null);
  const [rightLng, setRightLng] = useState(null);
  const latDegree = 111.32;
  const apiKey = process.env.REACT_APP_APIKEY;
  const [trigger, setTrigger] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");

  const calculateCoordinate = () => {
    const num = parseFloat(area);
    if (!isNaN(num)) {
      const calculatedDistance = Math.sqrt(num) / 2;
      setDistance(calculatedDistance);
      const latInDegrees = parseFloat(lat);
      const lngInDegrees = parseFloat(lng);
      const distanceInDegreesLat = calculatedDistance / latDegree;
      const distanceInDegreesLng =
        calculatedDistance /
        (latDegree * Math.cos((latInDegrees * Math.PI) / 180));
      setLeftLat(latInDegrees - distanceInDegreesLat);
      setLeftLng(lngInDegrees - distanceInDegreesLng);
      setRightLat(latInDegrees + distanceInDegreesLat);
      setRightLng(lngInDegrees + distanceInDegreesLng);
    } else {
      setDistance(4);
      setArea(16);
    }
    setTrigger(true);
  };

  useEffect(() => {
    if (
      trigger &&
      leftLat !== null &&
      leftLng !== null &&
      rightLat !== null &&
      rightLng !== null
    ) {
      fetchData();
    }
  }, [trigger, leftLat, leftLng, rightLat, rightLng]);

  const fetchData = async (pageToken = "") => {
    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
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
              "places.displayName,places.formattedAddress,places.priceLevel,nextPageToken",
          },
        }
      );

      console.log(response.data);
      if (response.data.nextPageToken) {
        fetchData(response.data.nextPageToken);
      } else {
        setNextPageToken("");
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setTrigger(false);
    }
  };

  return (
    <div className="locationSearchContainer">
      <div className="locationSearchContent">
        <div className="locationSearchCoordinates">
          {" "}
          <input
            placeholder="y koordinatı"
            onBlur={(e) => setLat(parseFloat(e.target.value).toFixed(6))}
          />
          <input
            placeholder="x koordinatı"
            onBlur={(e) => setLng(parseFloat(e.target.value).toFixed(6))}
          />
        </div>
        <div className="locationSearchDetail">
          {" "}
          <input
            placeholder="aramak istediğiniz alan (m2)"
            onBlur={(e) => setArea(e.target.value)}
          />
          <input
            placeholder="aramak istediğiniz tür"
            onBlur={(e) => setType(e.target.value)}
          />
        </div>
        <div className="locationSearchButton">
          {" "}
          <button onClick={calculateCoordinate}>Koordinatla Arama</button>
        </div>
      </div>
    </div>
  );
}

export default LocationSearch;
