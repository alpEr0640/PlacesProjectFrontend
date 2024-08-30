import React, { useState } from "react";
import "../CSS/SearchTable.css";
import { useMainContext } from "../MainContext";

export default function SearchTable() {
  const { globalSearch } = useMainContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);

  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const currentData = globalSearch.slice(firstIndex, lastIndex);
  const denemeArray = currentData;

  const GoForward = () => {
    const lastPage = parseInt(globalSearch.length / dataPerPage);
    if (currentPage !== lastPage) {
      setCurrentPage(currentPage + 1);
    }
    
  };

  const GoBack = ()=>{
    if(currentPage!== 1){
      setCurrentPage(currentPage-1)
    }
  }
  return (
    <div className="tableContainer">
      <div> asdfasdf</div>
      <table className="tableContent">
        <thead>
          <tr>
            <th>Yer İsmi</th>
            <th>Adres</th>
          </tr>
        </thead>
        <tbody>
          {denemeArray.map((type, index) => (
            <tr key={index}>
              <td>{type.displayName.text}</td>
              <td>{type.formattedAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={GoBack}>Geri Git </button>
      <button onClick={GoForward}> İleri Git </button>
    </div>
  );
}
