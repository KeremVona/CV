import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import RegisterLogin from './pages/RegisterLogin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/registerlogin" element={<RegisterLogin />} />
        <Route path ="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App
