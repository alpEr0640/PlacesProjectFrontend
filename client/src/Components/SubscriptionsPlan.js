import React from "react";
import "../CSS/SubscriptionsPlan.css";
export default function SubscriptionsPlan() {
  return (
    <div className="plansContainer" id="subs">
      <div className="plans">
        <div className="plan lite">
          <div className="planHeader">Lite</div>
          <div className="planPrice">
            <p>2500 TL/AYLIK</p>
            <p>İdeal Başlangıç Paketi</p>
          </div>
          <div className="planBody">
            <ul className="planList">
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>50 arama hakkı
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>10 arama kayıt etme
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Tek seferde 60 veriye ulaşım
                seçeneği
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>İşletme ismi, adresi, telefon
                numarası, web adresi, e-posta bilgilerine ulaşma
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Müşteri desteği
              </li>
            </ul>
            <div className="subsDetailContainer">
              <button className="subsDetailButton"> Hemen Başlayalım</button>
            </div>
          </div>
        </div>
        <div className="plan standard">
          <div className="planHeader">Standart</div>
          <div className="planPrice">
            <p> 3500 TL/AYLIK</p>
            <p> Gelişmiş Kullanıcı Paketi</p>
          </div>
          <div className="planBody">
            <ul className="planList">
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>100 arama hakkı
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>20 arama kayıt etme
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Tek seferde 60 ve 120 veriye
                ulaşım seçeneği
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Aylık 1 hedef firma analiz
                raporu
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>İşletme ismi, adresi, telefon
                numarası, web adresi, e-posta bilgilerine ulaşma
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Müşteri desteği
              </li>
            </ul>
            <div className="subsDetailContainer">
              <button className="subsDetailButton"> Hemen Başlayalım</button>
            </div>
          </div>
        </div>
        <div className="plan premium">
          <div className="planHeader">Premium</div>
          <div className="planPrice">
            <p> 12500 TL/Aylık</p>
            <p> Profesyonel Paket</p>
          </div>
          <div className="planBody">
            <ul className="planList">
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>500 arama hakkı
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>30 arama kayıt etme
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Tek seferde 60, 120 ve 240
                veriye ulaşım seçeneği
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Aylık 3 hedef firma analiz
                raporu
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Çoklu kullanıcı erişimi
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Yerinde destek imkanı
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>İşletme ismi, adresi, telefon
                numarası, web adresi, e-posta bilgilerine ulaşma
              </li>
              <li className="planListItem">
                <i class="fa-solid fa-check"></i>Müşteri desteği
              </li>
            </ul>
            <div className="subsDetailContainer">
              <button className="subsDetailButton"> Hemen Başlayalım</button>
            </div>
          </div>
        </div>
      </div>
      <div className="note">Not:Her 60 veride 1 arama hakkı gider</div>
    </div>
  );
}
