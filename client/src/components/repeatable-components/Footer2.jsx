import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "./Footer2.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import selligologo from "../../assets/Home/selligo-logo-purple.png";

const Footer2 = () => {
  const userStatus = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="footer-section">
      <MDBFooter
        bgColor="light"
        className="text-center text-lg-start text-muted"
      >
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            <a
              className="me-4 text-reset"
              onClick={() => {
                window.open(
                  "https://www.facebook.com/profile.php?id=61555141318387&mibextid=LQQJ4d",
                  "_blank"
                );
              }}
            >
              <FacebookIcon />
            </a>
            <a
              className="me-4 text-reset"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/selligo.in_/?igsh=ZmxsZWtjd21lbjA5&utm_source=qr",
                  "_blank"
                )
              }
            >
              <InstagramIcon />
            </a>

            <a
              href={`https://wa.me/${917892563937}`}
              target="_blank"
              rel="noopener noreferrer"
              className="me-4 text-reset"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </section>

        <section className="">
          <MDBContainer className="text-center text-md-start mt-0">
            <MDBRow className="mt-3">
              <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <MDBIcon icon="gem" className="me-3" />
                  <div
                    className="selligo-logo-footer-image"
                    onClick={() => {
                      navigate("/");
                      window.scrollTo(0, 0);
                    }}
                  ></div>
                </h6>
                <p>
                  A trusted mobile resale company specializing in buying
                  high-quality second-hand smartphones, providing a convenient
                  and reliable solution for users looking to upgrade or sell
                  their mobile devices
                </p>
              </MDBCol>

              <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Sell</h6>
                <p>
                  <a
                    className="text-reset footer-anchor-tags"
                    onClick={() => {
                      navigate("/mobile");
                    }}
                  >
                    Mobile
                  </a>
                </p>
                <p>
                  <a
                    className="text-reset footer-anchor-tags"
                    onClick={() => {
                      navigate("/tablet");
                    }}
                  >
                    Tablet
                  </a>
                </p>
                <p>
                  <a
                    className="text-reset footer-anchor-tags"
                    onClick={() => {
                      navigate("/watch");
                    }}
                  >
                    Watch
                  </a>
                </p>
              </MDBCol>

              <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                {!userStatus && (
                  <p>
                    <a
                      className="text-reset"
                      onClick={() => {
                        navigate("/sellify-login");
                      }}
                    >
                      Login
                    </a>
                  </p>
                )}

                <p>
                  <a
                    className="text-reset footer-anchor-tags"
                    onClick={() => {
                      navigate("/contact");
                    }}
                  >
                    Contact Us
                  </a>
                </p>
                <p>
                  <a
                    className="text-reset footer-anchor-tags"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Home
                  </a>
                </p>
                {userStatus && (
                  <p>
                    <a
                      className="text-reset footer-anchor-tags"
                      onClick={() => {
                        navigate("/orders");
                      }}
                    >
                      Orders
                    </a>
                  </p>
                )}
              </MDBCol>

              <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>

                <a
                  href={`mailto:selligo.in@gmail.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset footer-anchor-tags me-2"
                >
                  selligo.in@gmail.com
                </a>

                <br />

                <a
                  href={`tel:${7892563937}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset footer-anchor-tags me-2"
                >
                  +91 7892563937
                </a>

                <p className="footer-last-address">
                  No 21 7th cross Ibf road,
                  <br />
                  Bangalore 560004
                </p>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>

        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          © 2023 Copyright:
          <a className="text-reset fw-bold footer-anchor-tags" href="/">
            Selligo
          </a>
        </div>
      </MDBFooter>
    </div>
  );
};

export default Footer2;
