import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authorization.css';

function Authorization() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('register'); // 'register' | 'login'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register') {
      if (!fullName || !email || !password || !agree) {
        setError('Please complete all fields and accept terms.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Email and password are required.');
        return;
      }
    }
    try {
      setError('');
      if (mode === 'register') {
        await axios.post('http://localhost:3000/api/auth/register', {
          name: fullName,
          email,
          password
        });
        // auto-login after register
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', { email, password });
        localStorage.setItem('finsevak_token', loginRes.data.token);
        navigate('/home');
      } else {
        const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
        localStorage.setItem('finsevak_token', res.data.token);
        navigate('/home');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <div className="auth-hero">
      <div className="auth-card">
        <div className="auth-logo">
          <span role="img" aria-label="logo">💰</span>
          <span>FinSevak</span>
        </div>
        <h1>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-sub">{mode === 'register' ? 'Sign up to start your journey.' : 'Sign in to continue.'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="field">
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g., Bhargav Patel" />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a strong password" />
          </div>
          {mode === 'register' && (
            <label className="checkbox">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              I agree to the Terms and Privacy Policy
            </label>
          )}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-btn">{mode === 'register' ? 'Create Account' : 'Sign In'}</button>
        </form>
        <div className="auth-footer">
          {mode === 'register' ? (
            <span>Already have an account? <button className="link-btn" type="button" onClick={() => setMode('login')}>Sign in</button></span>
          ) : (
            <span>New here? <button className="link-btn" type="button" onClick={() => setMode('register')}>Create an account</button></span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Authorization;


