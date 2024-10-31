import React, { useEffect, useState } from "react";
import "../CSS/SearchTable.css";
import { useMainContext } from "../MainContext";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Loading, Notify } from "notiflix";
import axios from "axios";
import { useAuth } from "../AuthContext";
import SaveFileModal from "./SaveFileModal";

export default function SearchTable() {
  const pageNumbers = [];
  const { globalSearch, setGlobalSearch, globalAddress, setGlobalAddress } =
    useMainContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(20);
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const totalPages = Math.ceil(globalSearch.length / dataPerPage);
  const { validateToken } = useAuth();
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const currentData = globalSearch.slice(firstIndex, lastIndex);
  const [deneme, setDeneme] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const GoForward = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const GoBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  window.onresize = function () {
    setDeneme(window.innerWidth);
  };

  const renderPageNumbers = () => {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          id={i}
          className={currentPage === i ? "activePage" : null}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </li>
      );
    }

    return pageNumbers;
  };

  //Dosya Kaydetme Başlangıç
  const checkFileExists = async (fileName) => {
    console.log(fileName);
    const token = window.localStorage.getItem("token");
    try {
      console.log("response");
      const response = await axios.get(
        `${backendurl}home/checkFileExists/${fileName}`,

        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.result === false) {
        saveData(fileName);
        console.log("asdf");
      } else {
        Notify.failure("Dosya İsmi Mevcut");
        Loading.remove();
      }
      console.log(response);
    } catch (e) {
      Loading.remove();
      console.log(e.response);
    }
  };

  const saveData = async (fileName) => {
    const token = window.localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${backendurl}home/saveSearchResults`,
        { address: globalAddress, name: fileName, data: globalSearch },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      setShowModal(false);
      Notify.success("Kaydetme Başarılı");
    } catch (e) {
      if (e.response) {
        if (e.response.status === 403) {
          Notify.failure("Kaydetme Limitini Aştınız");
          setShowModal(false);
        } else {
          Notify.failure("Beklenmeyen Bir Hata Oluştu");
          console.log(e);
        }
      } else {
        Notify.failure("Beklenmeyen Bir Hata Oluştu");
      }
    } finally {
      Loading.remove();
    }
  };
  //Dosya Kaydetme Bitiş

  //Dosya İndirme Başlangıç

  const downloadData = async () => {
    const payload = {
      data: globalSearch,
    };
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    }
    console.log(globalSearch);
    try {
      const res = await axios.post(`${backendurl}home/downloadExcel`, payload, {
        headers: {
          Authorization: `${token}`,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      if (e.response) {
        if (e.response.status === 429) {
          Notify.failure("İstek Limitini Aştınız");
        } else {
          Notify.failure("İndirme İşlemi Başarısız");
        }
      } else {
        console.log(e);
        Notify.failure("Beklenmeyen Bir Hata Oluştu");
      }

      console.log(e);
    }
  };
  //dosya indirme bitiş

  //veri temizleme başlangıç
  const clearData = () => {
    Confirm.show(
      "UYARI",
      "Arama geçmişini temizlemek istiyor musunuz?",
      "Evet",
      "Hayır",
      () => {
        Notify.info("Başarılı");
        setGlobalSearch("");
      },
      () => {},
      {
        width: "400px",
        titleColor: "#00B4C4",
        okButtonBackground: "#00B4C4",
        success: {
          background: "red",
        },
      }
    );
  };

  //veri temizleme bitiş
  return (
    <div className="tableContainer">
      <div className="searchTableContainer">
        <button
          className="searchTableButton"
          onClick={() => {
            setShowModal(true);
          }}
        >
          {" "}
          Kaydet
        </button>
        <button className="searchTableButton" onClick={clearData}>
          Temizle
        </button>
        <button className="searchTableButton" onClick={downloadData}>
          İndir
        </button>
      </div>
      <div className="alper">
        <table className="tableContent">
          <thead>
            <tr>
              <th className="SearchLocationTh">Yer İsmi</th>
              <th className="SearchLocationTh">Adres</th>
              <th className="SearchLocationTh">Web Sitesi</th>
              <th className="SearchLocationTh">Telefon Numarası</th>
              <th className="SearchLocationTh">E-posta</th>
              <th className="SearchLocationTh">işletme Puanı</th>
            </tr>
          </thead>
          <tbody>
          
            {currentData.map((type, index) => (
              <tr key={index}>
                <td className="searchLocationTd">
                <a href={type.googleMapsUri} target="_blank">
                    {" "}
                    {type.displayName.text}
                  </a>
                </td>
                <td className="searchLocationTd">{type.formattedAddress}</td>
                <td className="searchLocationTd">
                  <a href={type.websiteUri} target="_blank">
                    {" "}
                    {type.websiteUri}
                  </a>
                </td>
                <td className="searchLocationTd">
                  {type.internationalPhoneNumber}
                </td>
                <td className="searchLocationTd">{type.emails}</td>
                <td className="searchLocationTd"><i class="fa-solid fa-star"></i>  {type.rating} </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="Pagination">
          <button
            className={"paginationButton"}
            onClick={GoBack}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <ul className="pageNumbersUl">{renderPageNumbers()}</ul>
          <button
            className="paginationButton"
            onClick={GoForward}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>

      {showModal === true ? (
        <SaveFileModal
          showModal={showModal}
          setShowModal={setShowModal}
          saveData={saveData}
          checkFileExists={checkFileExists}
        />
      ) : null}
    </div>
  );
}
