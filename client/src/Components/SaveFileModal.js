import React, { useState } from "react";
import "../CSS/saveFileModal.css";
export default function SaveFileModal(props) {
  const { setShowModal, showModal, saveData,checkFileExists } = props;
  const [fileName, setFileName] = useState("");

  const handleSave = () => {
    checkFileExists(fileName);
  };
  return (
    <div className="saveFileModal">
      <div className="saveFileModalContainer">
        <div className="saveFileModalContent">
          <div className="saveFileModalHeader">
            <h2> Kaydet </h2>
          </div>
          <div className="saveFileModalBody">
            <input
              placeholder="Dosya Adı"
              onBlur={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="saveFileModalButton">
            <button onClick={() => handleSave()}> Kaydet</button>
            <button onClick={() => setShowModal(false)}> İptal</button>
          </div>
        </div>
      </div>
    </div>
  );
}
