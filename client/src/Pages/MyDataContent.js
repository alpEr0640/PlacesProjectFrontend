import React, { useContext, useEffect, useState } from "react";
import { useMainContext } from "../MainContext";
import { useNavigate } from "react-router-dom";
import "../CSS/MyDataContent.css";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { Loading, Notify } from "notiflix";
export default function MyDataContent() {
    const myDataPageNumbers = [];
  const { myData, setMyData } = useMainContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(20);
  const totalPages = Math.ceil(myData.length / dataPerPage);
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const currentData = myData.slice(firstIndex, lastIndex);
  const navigate = useNavigate();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const { validateToken } = useAuth();

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

  const rendermyDataPageNumbers = () => {
    for (let i = 1; i <= totalPages; i++) {
      myDataPageNumbers.push(
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

    return myDataPageNumbers;
  };

  const handleDownload = async () => {
    const payload = {
      data: myData,
    };
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    }
    try {
      Loading.standard({ svgColor: "#00B4C4" });
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
      if (e.response.status === 429) {
        Notify.failure("İstek Limitini Aştınız");
      } else {
        Notify.failure("İndirme İşlemi Başarısız");
      }
    } finally {
      Loading.remove();
    }
  };

  return (
    <div className="Furkan">
      <div className="myDataContainer">
        <div className="myDataButton">
          <button onClick={() => handleDownload()}>İndir</button>
        </div>
        <table className="myDataContent">
          <thead>
            <tr>
              <th className="myDataTh">Yer İsmi</th>
              <th className="myDataTh">Adres </th>
              <th className="myDataTh">Web Sitesi</th>
              <th className="myDataTh">Telefon Numarası</th>
              <th className="myDataTh">E-posta</th>
              <th className="myDataTh">İşletme Puanı</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((index, key) => (
              <tr key={key}>
                <td className="myDataTd"> {index.displayName.text}</td>
                <td className="myDataTd"> {index.formattedAddress}</td>
                <td className="myDataTd">
                  {" "}
                  <a href={index.websiteUri} target="_blank">
                    {index.websiteUri}
                  </a>
                </td>
                <td className="myDataTd"> {index.internationalPhoneNumber}</td>
                <td className="myDataTd"> {index.emails}</td>
                <td className="searchLocationTd">
                  {index.rating ? (
                    <>
                      <i class="fa-solid fa-star"></i> {index.rating}
                    </>
                  ) : null}{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="myDataPagination">
          <button
            className={"myDataPaginationButton"}
            onClick={GoBack}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <ul className="myDataPageNumbersUl">{rendermyDataPageNumbers()}</ul>
          <button
            className="myDataPaginationButton"
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
