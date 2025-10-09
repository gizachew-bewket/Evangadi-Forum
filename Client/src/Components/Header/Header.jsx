import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Appstate } from "../Pages/Appstate";
import { Appstate } from "../../Pages/Appstate";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(Appstate);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userid");
    setUser({});
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <Link to="/home">
          <div className="logo">
            <span className="logo-orange">EV</span>
            <span className="logo-black">NGADI</span>
          </div>
        </Link>
      </div>

      <nav className="nav">
        <Link to="/home">Home</Link>
        <Link to="/About">How it works</Link>

        {!user?.username ? (
          <button className="signin-btn" onClick={() => navigate("/login")}>
            SIGN IN
          </button>
        ) : (
          <button className="signin-btn" onClick={handleLogout}>
            LOG OUT
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
