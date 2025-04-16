import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './pages/login/login';
import SignUpForm from './pages/login/sign-up';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/sign-up" element={<SignUpForm />} />
      </Routes>
    </Router>
  );
}

export default App;
