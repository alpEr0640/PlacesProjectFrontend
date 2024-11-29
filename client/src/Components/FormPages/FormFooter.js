import React from "react";
import "../../CSS/FormPages/FormFooter.css";
import { MDBFooter, MDBContainer, MDBCol, MDBRow } from "mdb-react-ui-kit";
export default function FormFooter() {
  return (
    <MDBFooter
      style={{ backgroundColor: "#00b4c4" }}
      className="text-white text-center text-lg-left mt-5 "
    >
      <MDBContainer className="p-4">
        <MDBRow>
          <MDBCol lg="3" md="12" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">SECTOR SCOUT</h5>

            <p>TİCARETİ ARTIR - PAZARINI BÜYÜT</p>
          </MDBCol>

          <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
            <h5 className="text-uppercase">İletisim</h5>

            <ul className="list-unstyled mb-0">
              <li>
                <a className="text-white">info@sectorscout.com.tr</a>
              </li>
              <li>
                <a className="text-white">0555 555 55 55</a>
              </li>
            </ul>
          </MDBCol>

          <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
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
          <MDBCol lg="3" md="6" className="mb-4 mb-md-0">
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
