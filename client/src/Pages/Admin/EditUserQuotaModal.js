import React, { useEffect, useState } from "react";

export default function EditUserQuotaModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    uid: user.uid,
    quota: user.quota,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log("formdata: ", formData);
  }, [formData]);

  return (
    <div className="editUserModalContainer">
      <div className="editUserModalContent">
        <div className="card">
          <div className="cardHeader">
            <i className="fa-solid fa-x" onClick={onClose}></i>
            <p>Kullanıcı Bilgileri</p>
          </div>
          <div className="cardBody">
            <label>User ID: {formData.uid}</label>

            <input
              type="number"
              name="quota"
              placeholder="Kota"
              onChange={handleChange}
              defaultValue={formData.quota}
            />
            <button
              onClick={() => {
                onSave(formData);
              }}
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
