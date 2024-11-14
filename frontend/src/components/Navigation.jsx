// src/components/Navbar.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "../style/Navigation.module.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navHeader}>
        <button className={classes.menuToggle} onClick={toggleMenu}>
          ☰
        </button>
      </div>
      <ul className={`${classes.navList} ${isMenuOpen ? classes.showMenu : ""}`}>
        <li className={classes.navItem}>
          <Link to="/addWorkDay" className={classes.navLink}>
            הוספת משמרת
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link to="/allWorkDays" className={classes.navLink}>
            המשמרות שלי
          </Link>
        </li>
        {!token && (
          <li className={classes.navItem}>
            <Link to="/login" className={classes.navLink}>
              להתחבר
            </Link>
          </li>
        )}
        {token && (
          <li className={classes.navItem}>
            <Link to="/login" className={classes.navLink} onClick={handleLogout}>
              להתנתק
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
