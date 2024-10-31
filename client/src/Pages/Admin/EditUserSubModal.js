import React, { useEffect, useState } from "react";

export default function EditUserSubModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    uid: user.uid,
    subscriptionType: user.subscriptionType ? user.subscriptionType : "Lite",
  });
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //   };
  //   useEffect(() => {
  //     onSave(formData);
  //   }, [formData]);

  return (
    <div className="editUserModalContainer">
      <div className="editUserModalContent">
        <div className="card">
          <div className="cardHeader">
            <i className="fa-solid fa-x" onClick={onClose}></i>
            <p>Kullanıcı Abonelik Tanımlama</p>
          </div>
          <div className="cardBody">
            <label>User ID: {formData.uid}</label>

            <select
              onChange={(e) => {
                setFormData({ ...formData, subscriptionType: e.target.value });
              }}
            >
              <option value="Lite">Lite</option>
              <option value="Standart">Standart</option>
              <option value="Premium">Premium</option>
            </select>

            {/* <button
              onClick={() => {
                setFormData({ ...formData, subscriptionType: "Lite" });
              }}
            >
              Lite Abonelik
            </button>

            <button
              onClick={() => {
                setFormData({ ...formData, subscriptionType: "Standart" });
                onSave(formData);
              }}
            >
              Standart Abonelik
            </button>

            <button
              onClick={() => {
                setFormData({ ...formData, subscriptionType: "Premium" });
                onSave(formData);
              }}
            >
              Premium Abonelik
            </button> */}

            {/* <input
              type="number"
              name="quota"
              placeholder="Kota"
              onChange={handleChange}
              defaultValue={formData.quota}
            /> */}
            <button
              onClick={() => {
                onSave(formData);
              }}
            >
              Abonelik Tanımla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
