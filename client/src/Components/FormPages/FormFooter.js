import React from "react";
import "../../CSS/FormPages/FormFooter.css";
import { MDBFooter, MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
export default function FormFooter() {
  return (
    <MDBFooter
    style={{ backgroundColor: "#00b4c4", width: "100%" }}
    className="text-white text-center text-lg-left mt-5"
  >
    <MDBContainer fluid className="p-4 mx-0">
      <MDBRow className="mx-0">
        <MDBCol lg="6" md="12" className="mb-4 mb-md-0">
          <h5 className="text-uppercase">SECTOR SCOUT</h5>
          <p>
            Sector Scout ile ticaretinizi artırın, pazarınızı büyütme fırsatını
            yakalayın aşağı sector scout ne iş yapıyor kısa bi özet Sector Scout,
            işletmelerin ihtiyaç duyduğu verileri hızlı ve güvenilir bir şekilde
            sunarak iş süreçlerini güçlendirir. Satış ve tedarik süreçlerinde
            sunduğu kapsamlı destekle, işletmelerin rekabet avantajını artırır.
            Ayrıca, en uygun çözümleri en cazip fiyatlarla sunmayı misyon
            edinerek, müşterilerine hem ekonomik hem de stratejik fayda sağlamayı
            hedefler.
          </p>
        </MDBCol>
        <MDBCol lg="2" md="6" className="mb-4 mb-md-0">
          <h5 className="text-uppercase">İletişim</h5>
          <ul className="list-unstyled mb-0">
            <li>
              <a className="text-white">info@sectorscout.com.tr</a>
            </li>
            <li>
              <a className="text-white">0555 555 55 55</a>
            </li>
          </ul>
        </MDBCol>
        <MDBCol lg="2" md="6" className="mb-4 mb-md-0">
          <h5 className="text-uppercase mb-0">Sosyal Medya</h5>
          <ul className="list-unstyled">
            <li>
              <a
                href="https://www.linkedin.com/company/105443932"
                target="_blank"
                className="text-white"
              >
                Linkedin
              </a>
            </li>
            <li>
              <a href="#!" className="text-white">
                İnstagram
              </a>
            </li>
          </ul>
        </MDBCol>
        <MDBCol lg="2" md="6" className="mb-4 mb-md-0">
          <h5 className="text-uppercase">Sorun mu yaşıyorsunuz?</h5>
          <ul className="list-unstyled mb-0">
            <li>
              <a href="#!" className="text-white">
                support@sectorscout.com.tr
              </a>
            </li>
          </ul>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  
    <div
      className="text-center p-3"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      &copy; {new Date().getFullYear()} Copyright:{" "}
      <a className="text-white">sectorscout.com.tr</a>
    </div>
  </MDBFooter>
  );
}
