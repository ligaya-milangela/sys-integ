import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/meeting_screen');
    } catch (err) {
      alert(err.response.data.message || 'Login error');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="username" placeholder="Username" value={form.usermame} onChange={e => setForm({ ...form, username: e.target.value })} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Login</button>
      <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/signup`);
              }}
              style={{
                backgroundColor: '#d3d3d3',
                border: 'none',
                borderRadius: '15px',
                padding: '6px 15px',
                cursor: 'pointer'
              }}
            >
              Signup
            </button>
    </form>
  );
}
