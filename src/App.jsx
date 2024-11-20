// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Adminnavbar from './component/jsx/Adminnavbar';
import Admindashboard from './component/jsx/Admindashboard';
import AdminUser from './component/jsx/AdminUser';
import AdminFeedback from './component/jsx/AdminFeedback';
import AdminOrder from './component/jsx/AdminOrder';

const App = () => {
  return (
    <Router>
      <Adminnavbar/>
      <Routes>
        <Route path="/" element={<Admindashboard/>} />
        <Route path="/User" element={<AdminUser/>} />
        <Route path="/Feedback" element={<AdminFeedback/>} />
         <Route path="/Order" element={<AdminOrder/>} />
     </Routes>
    </Router>
  );
};

export default App;
