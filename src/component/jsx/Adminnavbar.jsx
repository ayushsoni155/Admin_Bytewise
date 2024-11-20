import React, { useState } from "react";
import "../css/Adminnavbar.css"; // Importing the CSS file
import { FaBars } from "react-icons/fa"; // Importing the Font Awesome icon
import { Link } from "react-router-dom";

const Adminnavbar= () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Toggle the navigation menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Scroll to the top when navigating
  const scrollToTop = () => {
    window.scrollTo(0, 0);  // Scrolls to the top of the page
  }
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    scrollToTop();
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          {/* Add the logo image here */}
          <img src="logo-transparent-png.png" alt="ByteWise Logo" className="logo-img" />
          <p id="tagline">Your toolkit for engineering success</p>
        </div>
        
        {/* Navigation Bar */}
        <nav className={isMenuOpen ? "nav-active" : ""}>
          <ul className="nav-Links">
            <li><Link to="/" onClick={handleLinkClick}>Dashboard</Link></li>
            <li><Link to="/Order" onClick={handleLinkClick}>Orders</Link></li>
            <li><Link to="/User" onClick={handleLinkClick}>Users</Link></li>
            <li><Link to="/Feedback" onClick={handleLinkClick}>Feedback</Link></li>
            <li><Link to="/" onClick={handleLinkClick}>Expense</Link></li>
            <li><Link to="/" onClick={handleLinkClick}>Accounts</Link></li>
          </ul>
        </nav>
        
        {/* Menu Icon for Mobile View */}
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>
      </div>
    </header>
  );
};

export default Adminnavbar;

