import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FormModal({ form, onClose }) {
  const [formdata, setFormdata] = useState(form);
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const getForm = async (form, token) => {
    try {
      var res = await axios.get(`${backendurl}admin/getForm/${form.fid}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log(res.data);
      setFormdata(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("formdata: ", form);
    const token = localStorage.getItem("token");
    getForm(form, token);
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(
      isoDate._seconds * 1000 + isoDate._nanoseconds / 1000000
    );
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
    <div className="FormModalContainer">
      <div className="FormModalContent">
        <div className="formModalCard">
          <div className="formModalCardHeader">
            <i className="fa-solid fa-x" onClick={onClose}></i>
            <p>Form Bilgileri</p>
          </div>
          <div className="formModalCardBody">
            {formdata?.formdata?.option == 0 ? (
              <>
                <div className="formModalFormInfoColumn">
                  <div>
                    <label>Form id:</label>
                    <p>{formdata?.fid}</p>
                  </div>
                  <div>
                    <label>Form Kayıt Tarihi:</label>
                    <p>{formatDate(formdata?.formCreationDate)}</p>
                  </div>
                  <div>
                    <label>Form Durumu:</label>
                    <p>{formdata?.status}</p>
                  </div>
                  <div>
                    <label>Form Türü</label>
                    <p>{formdata?.formdata?.formType}</p>
                  </div>
                  <div>
                    <label>Veri Türü</label>
                    <p>{formdata?.formdata?.additionalFields?.dataType}</p>
                  </div>
                  <div>
                    <label>Veri Sayısı</label>
                    <p>{formdata?.formdata?.additionalFields?.dataCount}</p>
                  </div>
                  <div>
                    <label>Veri Kaynağı</label>
                    <p>{formdata?.formdata?.additionalFields?.dataSource}</p>
                  </div>
                  {formdata?.formdata?.additionalFields?.analysis && (
                    <div>
                      <label>Analiz Detayı</label>
                      <p>{formdata?.formdata?.additionalFields?.analysis}</p>
                    </div>
                  )}
                  <div>
                    <label>Veri Kaynağı</label>
                    <p>{formdata?.formdata?.additionalFields?.dataSource}</p>
                  </div>
                </div>

                <div className="formModalContactColumn">
                  <label> İLETİŞİM </label>
                  <div>
                    {formdata?.formdata?.contact?.companyName && (
                      <label>Firma Adı</label>
                    )}
                    <p>{formdata?.formdata?.contact?.companyName}</p>
                  </div>
                  <div>
                    <label>Ad</label>
                    <p>{formdata?.formdata?.contact?.name}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{formdata?.formdata?.contact?.email}</p>
                  </div>
                  <div>
                    {formdata?.formdata?.contact?.phone && (
                      <label>Telefon</label>
                    )}
                    <p>{formdata?.formdata?.contact?.phone}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="formModalFormInfoColumn">
                  <div>
                    <label>Form id:</label>
                    <p>{formdata?.fid}</p>
                  </div>
                  <div>
                    <label>Form Kayıt Tarihi:</label>
                    <p>{formatDate(formdata?.formCreationDate)}</p>
                  </div>
                  <div>
                    <label>Form Durumu:</label>
                    <p>{formdata?.status}</p>
                  </div>
                  <div>
                    <label>Form Türü</label>
                    <p>{formdata?.formdata?.formType}</p>
                  </div>
                  <div>
                    <label>Ürün</label>
                    <p>{formdata?.formdata?.additionalFields?.product}</p>
                  </div>

                  {formdata?.formdata?.additionalFields?.sellOrBuyPlace && (
                    <div>
                      <label>Ürün Nerelerden Alınır/Nerelere Satılır</label>
                      <p>
                        {formdata?.formdata?.additionalFields?.sellOrBuyPlace}
                      </p>
                    </div>
                  )}
                  <div>
                    <label>Fiyat</label>
                    <p>{formdata?.formdata?.additionalFields?.price}</p>
                  </div>
                  <div>
                    <label>Para Birimi</label>
                    <p>{formdata?.formdata?.additionalFields?.currency}</p>
                  </div>
                  {formdata?.formdata?.additionalFields?.details && (
                    <div>
                      <label>Detay</label>
                      <p>{formdata?.formdata?.additionalFields?.details}</p>
                    </div>
                  )}
                </div>

                <div className="formModalContactColumn">
                  <label> İLETİŞİM </label>
                  {formdata?.formdata?.contact?.companyName && (
                    <div>
                      {" "}
                      <label>Firma Adı</label>
                      <p>{formdata?.formdata?.contact?.companyName}</p>
                    </div>
                  )}
                  <div>
                    <label>Ad</label>
                    <p>{formdata?.formdata?.contact?.name}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{formdata?.formdata?.contact?.email}</p>
                  </div>
                  {formdata?.formdata?.contact?.phone && (
                    <div>
                      <label>Telefon</label>
                      <p>{formdata?.formdata?.contact?.phone}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
