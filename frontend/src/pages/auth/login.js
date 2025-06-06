import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../../styles/style.css';
import Swal from 'sweetalert2';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
    localStorage.setItem('token', res.data.token);

    await Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Welcome back!',
      confirmButtonColor: '#3b82f6',
      timer: 1500,
      showConfirmButton: false
    });

    navigate('/meeting_screen');
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: err.response?.data?.message || 'Something went wrong. Please try again.',
      confirmButtonColor: '#ef4444'
    });
  }
};


  return (
    <section>
      <div className="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="container">
        <div className="text-container">
          <div className="header-text">Attendance and Minutes Recording System</div>
        </div>
        <div className="form-container">
          <form onSubmit={handleLogin} style={{
            position: 'relative',
            width: '90%',
            maxWidth: '400px',
            padding: '2.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}>
            <h2 style={{
              color: '#f8fafc',
              textAlign: 'center',
              marginBottom: '2.5rem',
              fontSize: '1.75rem',
              fontWeight: '600'
            }}>Login</h2>
            
            <div style={{ 
              position: 'relative',
              marginBottom: '2rem'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                zIndex: 1
              }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#3b82f6',
                zIndex: 2,
                transform: isFocused.username ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease'
              }} />
              <input 
                type="text" 
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onFocus={() => setIsFocused({...isFocused, username: true})}
                onBlur={() => setIsFocused({...isFocused, username: form.username.length > 0})}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: 'none',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <label style={{
                position: 'absolute',
                left: 0,
                top: isFocused.username || form.username.length > 0 ? '-1.25rem' : '0.5rem',
                color: isFocused.username ? '#3b82f6' : 'rgba(248, 250, 252, 0.7)',
                fontSize: isFocused.username || form.username.length > 0 ? '0.75rem' : '1rem',
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}>
                Username
              </label>
            </div>
            
            <div style={{ 
              position: 'relative',
              marginBottom: '2.5rem'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                zIndex: 1
              }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#3b82f6',
                zIndex: 2,
                transform: isFocused.password ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease'
              }} />
              <input 
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setIsFocused({...isFocused, password: true})}
                onBlur={() => setIsFocused({...isFocused, password: form.password.length > 0})}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: 'none',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  paddingRight: '2rem' 
                }}
              />
              <label style={{
                position: 'absolute',
                left: 0,
                top: isFocused.password || form.password.length > 0 ? '-1.25rem' : '0.5rem',
                color: isFocused.password ? '#3b82f6' : 'rgba(248, 250, 252, 0.7)',
                fontSize: isFocused.password || form.password.length > 0 ? '0.75rem' : '1rem',
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(248, 250, 252, 0.7)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ':hover': {
                    color: '#3b82f6'
                  }
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '1rem',
                ':hover': {
                  backgroundColor: '#2563eb',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                },
                ':active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}