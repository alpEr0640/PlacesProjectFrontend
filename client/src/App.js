import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import { MainProvider, useMainContext } from "./MainContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

function App() {
  return (
    <MainProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </MainProvider>
  );
}

const AppContent = () => {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const storedLogged = window.localStorage.getItem("logged");
    setLogged(storedLogged === "true");
    console.log("Giriş durumu: ", storedLogged);
  }, []);

  const { isAuthenticated } = useAuth();
  const { isLogged } = useMainContext();

  return (
    <div className="app">
      {isLogged && <Navbar />}
      <Routes>
        <Route
          path="/homepage"
          element={isAuthenticated ? <Homepage /> : <Login />}
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
