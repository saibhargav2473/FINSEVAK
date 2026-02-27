import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AskAI from './components/AskAI';
import Learning from './components/Learning';
import Navbar from './components/Navbar';
import Authorization from './components/Authorization';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Calculators from './components/Calculators';
import Charts from './components/Charts';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';
  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <div className="main-content" style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Authorization />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/ask" element={<ProtectedRoute><AskAI /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
          <Route path="/calculators/*" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
