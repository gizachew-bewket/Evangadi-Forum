import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appstate } from "../../Pages/Appstate";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(Appstate);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // toggle mobile menu

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userid");
    setUser({});
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="menu-icon" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <Link to="/home">
          <div className="logo">
            <span className="logo-orange">EVA</span>
            <span className="logo-black">NGADI</span>
          </div>
        </Link>
      </div>

      <nav className={`nav ${menuOpen ? "show" : ""}`}>
        <Link to="/home" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/About" onClick={() => setMenuOpen(false)}>
          How it works
        </Link>

        {!user?.username ? (
          <button
            className="signin-btn"
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            Signin
          </button>
        ) : (
          <button
            className="signin-btn"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
