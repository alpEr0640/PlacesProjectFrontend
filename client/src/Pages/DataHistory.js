import React, { useEffect, useState } from "react";
import "../CSS/DataHistory.css";
import { Loading, Notify } from "notiflix";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useMainContext } from "../MainContext";
import { useNavigate } from "react-router-dom";

import { Navigate } from "react-router-dom";
export default function DataHistory() {
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const { myData, setMyData } = useMainContext();
  const { validateToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  /* useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]); */
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      Loading.standard({ svgColor: "#00B4C4" });
      await getSavedFiles();
    };
    fetchData();
  }, []);
  
  useEffect(()=>{
    if(isLoading===false){
      Loading.remove()
    }
    
  },[isLoading])

  const getSavedFiles = async () => {
    /* Loading.standard({ svgColor: "#00B4C4" }); */
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${backendurl}home/getSavedSearchResults`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setFileNames(response.data.files);
      setIsLoading(false);
      
    } catch (e) {
      if (e.response.status === 429) {
        Notify.failure("Çok Fazla İstek Gönderdiniz");
      }
      if (e.response.status === 404) {
        validateToken(window.localStorage.getItem("token"));
      } else {
        Notify.failure("Beklenmedik Bir Hatayla Karşılaştık");
        validateToken(window.localStorage.getItem("token"));
      }
    }
  };

  const handleGetFileContent = async (fileName) => {
    Loading.standard({ svgColor: "#00B4C4" });
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${backendurl}home/getFile/${fileName}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMyData(response.data.data);
      navigate("/myData");
    } catch (e) {
    } finally {
      Loading.remove();
    }
  };

  const handleDeleteData = async (fileName) => {
    Loading.standard({ svgColor: "#00B4C4" });
    const token = window.localStorage.getItem("token");
    console.log("dosya adı", fileName.file);
    try {
      const response = await axios.delete(
        `${backendurl}home/deleteFile`,

        {
          headers: {
            Authorization: token,
          },
          data: {
            name: fileName.file,
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (e) {
      console.log(e);
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="dataContainer">
      {isLoading ? ( 
        Loading.standard()
      ) :
      fileNames.length > 0 ? (
        fileNames.map((index, key) => (
          <div key={key} className="dataContent">
            <div className="deleteData" onClick={() => handleDeleteData(index)}>
              <i className="fa-solid fa-trash"></i>
            </div>
            <div
              className="dataBody"
              onClick={() => handleGetFileContent(index.file)}
            >
              <div className="dataFileName">
                <i className="fa-regular fa-folder"></i>

                <div>{index.file}</div>
              </div>
              <div className="dataAddress">
                <i className="fa-solid fa-location-dot"></i>
                <div>{index.address}</div>
              </div>
            </div>
            <div
              className="dataDetail"
              onClick={() => handleGetFileContent(index.file)}
            >
              <i className="fa-solid fa-angle-right"></i>{" "}
            </div>
          </div>
        ))
      ) : (
        <div className="dataContentNone">Kayıtlı Dosya Bulunmamaktadır</div>
      )}
    </div>
  );
}
