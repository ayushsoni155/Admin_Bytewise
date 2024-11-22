import React, { useState } from "react";
import "../css/Adminnavbar.css"; // Importing the CSS file
import { FaBars } from "react-icons/fa"; // Importing the Font Awesome icon
import { Link } from "react-router-dom";

const Adminnavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the side navigation menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu and scroll to top when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };

  return (
    <header>
      <div className="admin-navbar">
        {/* Logo */}
        <div className="logo">
           {/* Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>
          <img src="logo-transparent-png.png" alt="ByteWise Logo" className="logo-img" />
          <p id="tagline">Your toolkit for engineering success</p>
       

       
        </div>
        {/* Side Navbar */}
        <nav className={`side-nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/" onClick={handleLinkClick}>Dashboard</Link></li>
            <li><Link to="/Order" onClick={handleLinkClick}>Orders</Link></li>
            <li><Link to="/User" onClick={handleLinkClick}>Users</Link></li>
            <li><Link to="/Feedback" onClick={handleLinkClick}>Feedback</Link></li>
            <li><Link to="/" onClick={handleLinkClick}>Raw Materials</Link></li>
            <li><Link to="/" onClick={handleLinkClick}>Expense</Link></li>
            <li><Link to="/" onClick={handleLinkClick}>Accounts</Link></li>
          </ul>
        </nav>

        {/* Overlay */}
        {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
      </div>
    </header>
  );
};

export default Adminnavbar;
