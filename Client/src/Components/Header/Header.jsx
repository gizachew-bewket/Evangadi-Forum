import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="logo">
            <span className="logo-orange">EV</span>
            <span className="logo-black">NGADI</span>
          </div>
        </div>

        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">How it works</a>
          <button className="signin-btn">SIGN IN</button>
        </nav>
      </header>
    </>
  );
};

export default Header;
