import React, { useState } from "react";
import "../css/Adminnavbar.css"; // Importing the CSS file
import { FaBars } from "react-icons/fa"; // Importing the Font Awesome icon
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie'; // Import useCookies

const Adminnavbar= () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cookies] = useCookies(['Admin_bytewiseCookies']); // Use cookies to check login status

  // Toggle the navigation menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Scroll to the top when navigating
  const scrollToTop = () => {
    window.scrollTo(0, 0);  // Scrolls to the top of the page
  }

  // Check login status based on cookies
  const isLoggedIn = cookies.Admin_bytewiseCookies && cookies.Admin_bytewiseCookies.status === true;

  // Close the menu when a navigation link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    scrollToTop();
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
         <Link to='/' onClick={handleLinkClick}>
          <img src="logo-transparent-png.png" alt="ByteWise Logo" className="logo-img" /><Link/>
          <p id="tagline">Your toolkit for engineering success</p>
        </div>
        
        {/* Navigation Bar */}
        <nav className={isMenuOpen ? "nav-active" : ""}>
          <ul className="nav-Links">
            <li><Link to="/" onClick={handleLinkClick}>Dashboard</Link></li>
            <li><Link to="/" onClick={handleLinkClick}>Orders</Link></li>
            <li><Link to="/User" onClick={handleLinkClick}>Users</Link></li>
            <li><Link to="/Feedback" onClick={handleLinkClick}>Feedback</Link></li>
          </ul>
          
          {/* Conditional rendering for Login/Profile button */}
          {isLoggedIn ? (
            <button className="profile-btn">
              <Link to='/profile'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
              </Link>
            </button>
          ) : (
            <button id="LoginBtn">
              <Link to='/login'>Login</Link>
            </button>
          )}
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

