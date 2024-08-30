import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import AdminHomepage from "./Pages/Admin/Homepage";
import { MainProvider, useMainContext } from "./MainContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import RegisterUser from "./Pages/Admin/RegisterUser";
import ManageUsers from "./Pages/Admin/ManageUsers";

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

  /* useEffect(() => {
    const storedLogged = window.localStorage.getItem("logged");
    setLogged(storedLogged === "true");
    console.log("Giriş durumu: ", storedLogged);
  }, []); */

  const { isAuthenticated, validateToken } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/homepage"
          element={isAuthenticated ? <Homepage /> : <Login />}
        />
        <Route path="/"  element={!isAuthenticated ? <Login/> : <Homepage />}/>
        <Route path="/profile"  element={isAuthenticated ? <Profile/> : <Login />}/>
        {/* Admin routes */}
        <Route
          path="/admin/home"
          element={isAuthenticated ? <AdminHomepage /> : <Login />}
        />
        <Route
          path="/admin/registerUser"
          element={isAuthenticated ? <RegisterUser /> : <Login />}
        />
        <Route
          path="/admin/manageUsers"
          element={isAuthenticated ? <ManageUsers /> : <Login />}
        />
      </Routes>
    </div>
  );
};

export default App;
