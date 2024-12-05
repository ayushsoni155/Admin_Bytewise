import React, { useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import Notification from "./Notification";
import "../css/AdminLogin.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const correctPassword = process.env.LOGIN_PASSWORD; // Replace with the actual password
 
const secretKey = '@@@@1234@bytewise24';


  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ password: value });
  };

  const handleLogin = () => {
     console.log(correctPAssword);
    if (formData.password === correctPassword) {
      // Encrypt the cookie value
      const encryptedValue = CryptoJS.AES.encrypt(
        JSON.stringify({ admin: true }),
        secretKey
      ).toString();

      // Set the encrypted cookie
      Cookies.set("adminBytewise", encryptedValue, { expires: 1 }); // 1-day expiration

      onLoginSuccess();
      setNotification({ message: "Login successful!", type: "success" });
    } else {
      setNotification({ message: "Incorrect password.", type: "error" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div id="overlayLogin">
      <div className="logSign-container">
        <div className="logSign-img-container">
          <img src="logo-transparent-png.png" alt="Admin Login" />
        </div>
        <div className="logSign-form-container">
          <h2>Admin Login</h2>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
