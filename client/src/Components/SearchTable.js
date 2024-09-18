import React, { useEffect, useState } from "react";
import "../CSS/SearchTable.css";
import { useMainContext } from "../MainContext";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function SearchTable() {
  const pageNumbers = [];
  const { globalSearch, setGlobalSearch } = useMainContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(7);
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const totalPages = Math.ceil(globalSearch.length / dataPerPage);
  const { validateToken } = useAuth();
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const currentData = globalSearch.slice(firstIndex, lastIndex);
  const [deneme, setDeneme] = useState(window.innerWidth);

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

  const getVisiblePageNumbers = () => {
    const maxVisiblePages = deneme < 900 ? 3 : 9;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(
      currentPage + Math.floor(maxVisiblePages / 2),
      totalPages
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    }

    if (endPage === totalPages && endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
    }

    const visiblePageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePageNumbers.push(i);
    }
    return visiblePageNumbers;
  };

  const renderPageNumbers = getVisiblePageNumbers().map((number) => (
    <li
      key={number}
      id={number}
      className={currentPage === number ? "activePage" : null}
      onClick={() => setCurrentPage(number)}
    >
      {number}
    </li>
  ));
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
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  const clearData = () => {
    Confirm.show(
      "UYARI",
      "Arama geçmişini temizlemek istiyor musunuz?",
      "Yes",
      "No",
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
  return (
    <div className="tableContainer">
      <div className="searchTableContainer">
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
            </tr>
          </thead>
          <tbody>
            {currentData.map((type, index) => (
              <tr key={index}>
                <td className="searchLocationTd">{type.displayName.text}</td>
                <td className="searchLocationTd">{type.formattedAddress}</td>
                <td className="searchLocationTd">{type.websiteUri}</td>
                <td className="searchLocationTd">{type.internationalPhoneNumber}</td>
                {/* <td className="searchLocationTd">{type.currentOpeningHours.openNow===true ?"Açık":"Kapalı"}</td> */}
                
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
          <ul className="pageNumbersUl">{renderPageNumbers}</ul>
          <button
            className="paginationButton"
            onClick={GoForward}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
