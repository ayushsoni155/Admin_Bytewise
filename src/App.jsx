// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Adminnavbar from './component/jsx/Adminnavbar';
import Admindashboard from './component/jsx/Admindashboard';
import AdminUser from './component/jsx/AdminUser';

const App = () => {
  return (
    <Router>
      <Adminnavbar/>
      <Routes>
        <Route path="/" element={<Admindashboard/>} />
        <Route path="/User" element={<AdminUser/>} />
     </Routes>
    </Router>
  );
};

export default App;
