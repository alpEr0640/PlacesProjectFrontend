import React, { useEffect, useState } from "react";
import "../CSS/SearchTable.css";
import { useMainContext } from "../MainContext";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix";

export default function SearchTable() {
  const pageNumbers = [];
  const { globalSearch, setGlobalSearch } = useMainContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(7);

  const totalPages = Math.ceil(globalSearch.length / dataPerPage);

  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const currentData = globalSearch.slice(firstIndex, lastIndex);

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

  const getVisiblePageNumbers = () => {
    const maxVisiblePages = 9;

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
        <button className="searchTableButton">İndir</button>
      </div>
      <table className="tableContent">
        <thead>
          <tr>
            <th className="SearchLocationTh">Yer İsmi</th>
            <th className="SearchLocationTh">Adres</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((type, index) => (
            <tr key={index}>
              <td className="searchLocationTd">{type.displayName.text}</td>
              <td className="searchLocationTd">{type.formattedAddress}</td>
            </tr>
          ))}
        </tbody>
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
      </table>
    </div>
  );
}
