import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="logo-orange">EV</span>
            <span className="logo-white">NGADI</span>
          </div>

          <div className="footer-socials">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Useful Link</h4>
          <a href="#">How it works</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy policy</a>
        </div>

        <div className="footer-contact">
          <h4>Contact Info</h4>
          <p>Evngadi Networks</p>
          <p>support@evngadi.com</p>
          <p>+1-202-386-2702</p>
        </div>
      </footer>
    </>
  );
}

export default Footer