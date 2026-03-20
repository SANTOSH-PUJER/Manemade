import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/userService';
import '../styles/Auth.css';

const Auth = ({ mode: initialMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const res = await authService.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.phone,
          password: formData.password
        });
        if (res.status === 200) {
          alert('Registration Successful! Please Login.');
          setMode('login');
        }
      } else {
        const res = await authService.login({
          username: formData.email,
          password: formData.password
        });
        if (res.status === 200) {
          alert('Login Successful!');
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <div
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            LOGIN
          </div>
          <div
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            SIGNUP
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{mode === 'login' ? 'Login to your account' : 'Create an account'}</h2>

          {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          {mode === 'register' && (
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>{mode === 'login' ? 'Email or Mobile Number' : 'Email Address'}</label>
            <input 
              type={mode === 'login' ? 'text' : 'email'} 
              name="email" 
              placeholder={mode === 'login' ? 'Email or Mobile Number' : 'Email Address'} 
              onChange={handleChange} 
              required 
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'PROCESSING...' : (mode === 'login' ? 'LOGIN' : 'REGISTER')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
