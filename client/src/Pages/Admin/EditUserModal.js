import React, { useEffect, useState } from "react";

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...user });
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
        <div className="adminPageCard">
          <div className="adminPageCardHeader">
            <i className="fa-solid fa-x" onClick={onClose}></i>
            <p>Kullanıcı Bilgileri</p>
          </div>
          <div className="adminPageCardBody">
            <input
              type="text"
              name="firstname"
              placeholder="İsim"
              onChange={handleChange}
              defaultValue={formData.firstname}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Soyisim"
              onChange={handleChange}
              defaultValue={formData.lastname}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              defaultValue={formData.email}
            />
            <input
              type="text"
              name="phone"
              placeholder="Telefon"
              onChange={handleChange}
              defaultValue={formData.phone}
            />
            <input
              type="text"
              name="role"
              placeholder="Rol"
              onChange={handleChange}
              defaultValue={formData.role}
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
