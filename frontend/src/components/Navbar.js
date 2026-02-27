
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate(); // hook to navigate programmatically
  const isAuthed = Boolean(localStorage.getItem('finsevak_token'));

  const handleLogout = () => {
    localStorage.removeItem('finsevak_token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="logo">
          <span role="img" aria-label="logo">💰</span> FinSevak
        </Link>
        <Link to="/ask" className="nav-link">Ask AI</Link>
        <Link to="/learning" className="nav-link">Learning</Link>
        <Link to="/calculators" className="nav-link">Calculators</Link>
        <Link to="/charts" className="nav-link">Charts</Link>
      </div>
      <div className="nav-right">
        <button className="cta-btn" onClick={() => navigate('/ask')}>Get Advice</button>
        {!isAuthed && (
          <button className="cta-btn" style={{ marginLeft: 8 }} onClick={() => navigate('/')}>Login</button>
        )}
        {isAuthed && (
          <button className="cta-btn" style={{ marginLeft: 8 }} onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
