import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../CSS/Admin/ManageForms.css";
import FormModal from "./FormModal";

function ManageForms() {
  const [editTrigger, setEditTrigger] = useState(false);
  const navigate = useNavigate();
  const [forms, setForms] = useState();
  const [loading, setLoading] = useState(true);
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getForms(token);
  }, [editTrigger]);

  const getForms = async (token) => {
    try {
      var res = await axios.get(`${backendurl}admin/getForms`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log(res.data);

      setForms(
        res.data.forms.sort(
          (a, b) => new Date(a.formCreationDate) - new Date(b.formCreationDate)
        )
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const sortByDate = (data) => {
    return data.sort((a, b) => a.formCreationDate - b.formCreationDate);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      //second: "2-digit",
    });
  };

  return (
    <div className="manageFormsContainer">
      <div className="manageFormsContent">
        <h2>Manage Forms</h2>
        {loading ? (
          <p>Loading forms...</p>
        ) : (
          <table className="manageFormsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Form Tipi</th>
                <th>Email</th>
                <th>Durum</th>
                <th>Okundu</th>
                <th>Kayıt Tarihi</th>
                <th>Yönet</th>
              </tr>
            </thead>
            <tbody>
              {forms && forms.length > 0 ? (
                forms.map((form) => (
                  <tr key={form.fid}>
                    <td>{form.fid}</td>
                    <td>{form.formType}</td>
                    <td>{form.email}</td>
                    <td>{form.status}</td>
                    <td>{form.isRead}</td>
                    <td>{formatDate(form.formCreationDate)}</td>
                    <td className="actions">
                      <button
                        onClick={() => {
                          setSelectedForm(form);
                        }}
                      >
                        İncele
                      </button>
                      <button onClick={async () => {}}>Sil</button>
                      <button onClick={async () => {}}>İşleme Al</button>
                      <button onClick={async (e) => {}}>Tamamla</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Form Bulunamadı</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {selectedForm && (
        <div className="FormModal">
          <FormModal
            form={selectedForm}
            onClose={() => setSelectedForm(null)}
          />
        </div>
      )}
    </div>
  );
}

export default ManageForms;
