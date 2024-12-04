// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import Adminnavbar from "./component/jsx/Adminnavbar";
// import Admindashboard from "./component/jsx/Admindashboard";
// import AdminUser from "./component/jsx/AdminUser";
// import AdminFeedback from "./component/jsx/AdminFeedback";
// import AdminOrder from "./component/jsx/AdminOrder";
// import AdminProduct from "./component/jsx/AdminProduct";
// import AdminSales from "./component/jsx/AdminSales";
// import AdminExpenses from "./component/jsx/AdminExpenses";
// import AdminAccounts from "./component/jsx/AdminAccounts";

// import Cookies from "js-cookie";
// import AdminLogin from "./component/jsx/AdminLogin";

// const App = () => {
//   const [loginStatus, setLoginStatus] = useState(false);

//   // Check cookie status on initial load
//   useEffect(() => {
//     const cookieStatus = Cookies.get("adminBytewise");
//     setLoginStatus(cookieStatus === "true");
//   }, []);

//   // Callback function to update login status after a successful login
//   const handleLoginSuccess = () => {
//     setLoginStatus(true);
//   };

//   return (
//     <>
//       {loginStatus ? (
//         <Router>
//           <Adminnavbar />
//           <Routes>
//             <Route path="/" element={<Admindashboard />} />
//             <Route path="/User" element={<AdminUser />} />
//             <Route path="/Feedback" element={<AdminFeedback />} />
//             <Route path="/Order" element={<AdminOrder />} />
//             <Route path="/Product" element={<AdminProduct />} />
//             <Route path="/Sales" element={<AdminSales />} />
//             <Route path="/Expenses" element={<AdminExpenses />} />
//             <Route path="/Accounts" element={<AdminAccounts />} />
//           </Routes>
//         </Router>
//       ) : (
//         <AdminLogin onLoginSuccess={handleLoginSuccess} />
//       )}
//     </>
//   );
// };

// export default App;
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Adminnavbar from "./component/jsx/Adminnavbar";
import Admindashboard from "./component/jsx/Admindashboard";
import AdminUser from "./component/jsx/AdminUser";
import AdminFeedback from "./component/jsx/AdminFeedback";
import AdminOrder from "./component/jsx/AdminOrder";
import AdminProduct from "./component/jsx/AdminProduct";
import AdminSales from "./component/jsx/AdminSales";
import AdminExpenses from "./component/jsx/AdminExpenses";
import AdminAccounts from "./component/jsx/AdminAccounts";

import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import AdminLogin from "./component/jsx/AdminLogin";

const App = () => {
  const [loginStatus, setLoginStatus] = useState(false);

  // Define your secret key
  const secretKey = "@@@@1234bytewise24"; // Replace with a secure key

  // Decrypt cookie and check login status on initial load
  useEffect(() => {
    const encryptedCookie = Cookies.get("adminBytewise");
    if (encryptedCookie) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedCookie, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // Check if the decrypted data confirms admin login
        setLoginStatus(decryptedData.admin === true);
      } catch (error) {
        console.error("Failed to decrypt the cookie", error);
        setLoginStatus(false);
      }
    }
  }, []);

  // Callback function to update login status after a successful login
  const handleLoginSuccess = () => {
    setLoginStatus(true);
  };

  return (
    <>
      {loginStatus ? (
        <Router>
          <Adminnavbar />
          <Routes>
            <Route path="/" element={<Admindashboard />} />
            <Route path="/User" element={<AdminUser />} />
            <Route path="/Feedback" element={<AdminFeedback />} />
            <Route path="/Order" element={<AdminOrder />} />
            <Route path="/Product" element={<AdminProduct />} />
            <Route path="/Sales" element={<AdminSales />} />
            <Route path="/Expenses" element={<AdminExpenses />} />
            <Route path="/Accounts" element={<AdminAccounts />} />
          </Routes>
        </Router>
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default App;
