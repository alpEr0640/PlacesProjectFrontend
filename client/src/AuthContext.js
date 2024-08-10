import axios from "axios";
import Rect, {  createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const backendurl= process.env.REACT_APP_BACKEND_URL
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      validateToken(savedToken);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post(
        `${backendurl}api/validateToken`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      setToken(null);
    }
  };
  return(
    <AuthContext.Provider value={{isAuthenticated ,validateToken}}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=> useContext(AuthContext);
