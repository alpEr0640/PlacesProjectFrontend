import React, { createContext,useContext, useEffect, useState } from "react"

const MainContext = createContext(null);

export const MainProvider = ({ children})=>{
   
    const [globalSearch, setGlobalSearch] = useState("");
    const [globalAddress, setGlobalAddress] = useState("");
    const [myData , setMyData] = useState("");
    useEffect(()=>{
        console.log(globalAddress)
    },[globalAddress])
    return(
            <MainContext.Provider value={{setGlobalSearch, globalSearch, globalAddress, setGlobalAddress, myData , setMyData}}>
            {children}
        </MainContext.Provider>
    )
}



export const useMainContext=()=>useContext(MainContext);