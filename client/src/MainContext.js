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

  return (
    <MainContext.Provider
      value={{
        setGlobalSearch,
        globalSearch,
        globalAddress,
        setGlobalAddress,
        myData,
        setMyData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
