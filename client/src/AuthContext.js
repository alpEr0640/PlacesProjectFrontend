import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useMainContext } from "./MainContext";
import { Loading, Notify } from "notiflix";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { setIsLogged, isLogged } = useMainContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const backendurl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      validateToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post(
        `${backendurl}validate/validateToken`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        console.log("Doğrulandı");
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      Loading.remove();
      Notify.failure("Oturum Sonlandı");
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, validateToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
