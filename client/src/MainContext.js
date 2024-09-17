import React, { createContext,useContext, useEffect, useState } from "react"

const MainContext = createContext(null);

export const MainProvider = ({ children})=>{
   /*  const[isLogged , setIsLogged]= useState(false); */
    const [globalSearch, setGlobalSearch] = useState("");
   /*  const [isLoading, setIsLoading]= useState(false); */
/* 
    useEffect(() => {
        const storedLogged = window.localStorage.getItem("logged");
        if (storedLogged) {
          setIsLogged(true);
        }else{
            setIsLogged(false)
        }
      }, []);
 */
    return(
            <MainContext.Provider value={{setGlobalSearch, globalSearch}}>
            {children}
        </MainContext.Provider>
    )
}



export const useMainContext=()=>useContext(MainContext);