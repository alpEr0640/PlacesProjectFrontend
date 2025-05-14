import React, { createContext, useContext, useEffect, useState } from "react";

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [globalSearch, setGlobalSearch] = useState(
    () => JSON.parse(window.localStorage.getItem("mySearch")) || ""
  );
  const [globalAddress, setGlobalAddress] = useState(
    window.localStorage.getItem("myAddress")
  );
  const [myData, setMyData] = useState("");
  const [smallMatris, setSmallMatris] = useState([
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ]);
  const [middleMatris, setMiddleMatris] = useState([
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ]);

  const [edge, setEdge] = useState("");
  const latDegree = 111.32;
  const [divideTrigger, setDivideTrigger] = useState(false);
  const [isSearchContinue, setIsSearchContinue] = useState(false);
  const [dataCount, setDataCount] = useState("60");
  const smallObject = {
    rect1: {
      right: smallMatris[0][1],
      left: smallMatris[1][0],
    },
    rect2: {
      right: smallMatris[0][2],
      left: smallMatris[1][1],
    },
  };
  const middleObject = {
    rect1: {
      right: middleMatris[0][1],
      left: middleMatris[1][0],
    },
    rect2: {
      right: middleMatris[0][2],
      left: middleMatris[1][1],
    },
    rect3: {
      right: middleMatris[1][1],
      left: middleMatris[2][0],
    },
    rect4: {
      right: middleMatris[1][2],
      left: middleMatris[2][1],
    },
  };
  useEffect(() => {
    console.log(dataCount);
  }, [dataCount]);
  const divide1 = (coordinates) => {
    const { lat, lng } = coordinates;
    const changeLat = edge / 2 / latDegree;
    const changeLng =
      edge / 2 / (latDegree * Math.cos((parseFloat(lat) * Math.PI) / 180));
    const newMatrix = [...smallMatris];
    newMatrix[0][1] = [lng + changeLng, lat + changeLat];
    newMatrix[1][0] = [lng - changeLng, lat - changeLat];
    setSmallMatris(newMatrix);
    setDivideTrigger(true);
  };
  const divide2 = (coordinates) => {
    const { lat, lng } = coordinates;
    const changeLat = edge / 2 / latDegree;
    const changeLng =
      edge / 2 / (latDegree * Math.cos((parseFloat(lat) * Math.PI) / 180));
    const newMatrix = [...smallMatris];
    newMatrix[0][1] = [lng, lat + changeLat];
    newMatrix[1][0] = [lng - changeLng, lat - changeLat];
    newMatrix[0][2] = [lng + changeLng, lat + changeLat];
    newMatrix[1][1] = [lng, lat - changeLat];
    setSmallMatris(newMatrix);
    setDivideTrigger(true);
  };
  const divide4 = (coordinates) => {
    const { lat, lng } = coordinates;
    const changeLat = edge / 2 / latDegree;
    const changeLng =
      edge / 2 / (latDegree * Math.cos((parseFloat(lat) * Math.PI) / 180));
    const newMatrix = [...middleMatris];
    newMatrix[0][1] = [lng, lat + changeLat];
    newMatrix[1][0] = [lng - changeLng, lat];
    newMatrix[1][1] = [lng, lat];
    newMatrix[0][2] = [lng + changeLng, lat + changeLat];
    newMatrix[2][0] = [lng - changeLng, lat - changeLng];
    newMatrix[2][1] = [lng, lat - changeLat];
    newMatrix[1][2] = [lng + changeLng, lat];
    setSmallMatris(newMatrix);
    setDivideTrigger(true);
  };

  return (
    <MainContext.Provider
      value={{
        setGlobalSearch,
        globalSearch,
        globalAddress,
        setGlobalAddress,
        myData,
        setMyData,
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
        middleObject
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
