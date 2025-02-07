import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import RegisterLogin from './pages/RegisterLogin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
        <Route path ="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App
