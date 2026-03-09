import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/ProfileAdvanced';
import RecruiterDashboard from './pages/Recruiter/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.style.backgroundColor = '#212529';
      document.body.style.color = '#e9ecef';
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="App" data-darkmode={darkMode}>
        <div className="dark-mode-toggle">
          <button
            className="btn"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
