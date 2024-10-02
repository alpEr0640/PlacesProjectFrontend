import Login from "./Pages/Login";
import Loads from "./Animation/Loads";
import Profile from "./Pages/Profile";
import Location from "./Pages/Location";
import Homepage from "./Pages/Homepage";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import AdminHomepage from "./Pages/Admin/Homepage";
import ManageUsers from "./Pages/Admin/ManageUsers";
import { AuthProvider, useAuth } from "./AuthContext";
import RegisterUser from "./Pages/Admin/RegisterUser";
import { MainProvider, useMainContext } from "./MainContext";
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import DataHistory from "./Pages/DataHistory";
import MyDataContent from "./Pages/MyDataContent";
/* import { useMainContext } from "../MainContext"; */


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
  const currentLocation = useLocation();
  const { myData, setMyData } = useMainContext();

useEffect(() => {
    Loading.remove();
  }, [currentLocation.pathname]);

  const { isAuthenticated, validateToken,isLoading } = useAuth();
  if (isLoading) {
    return <Loads />;
  }
  /* Loading.remove(); */
  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/homepage"
          element={isAuthenticated ? <Homepage /> : <Login />}
        />
        
        <Route path="/"  element={!isAuthenticated ? <Login/> : <Homepage /> }/>
        <Route path="/profile"  element={isAuthenticated ? <Profile/> : <Login />}/>
        <Route path="/data"  element={isAuthenticated ? <DataHistory/> : <Login />}/>
        <Route path="/myData"  element={isAuthenticated ? (myData.length>0 ? <MyDataContent/>:<DataHistory/>)  : <Login />}/>
        <Route path="/location" element={isAuthenticated ? <Location/> : <Login/>}/>
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
