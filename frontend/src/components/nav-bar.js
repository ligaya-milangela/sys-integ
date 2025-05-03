import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const sidebarStyle = {
    width: '200px',
    height: '100vh',
    backgroundColor: '#ADD8E6',
    position: 'fixed',
    top: 0,
    left: 0,
    padding: '20px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '20px 0',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontSize: '16px',
  };

  return (
    <div style={sidebarStyle}>
      <button style={buttonStyle} onClick={() => navigate('/')}>Google Meet</button>
      <button style={buttonStyle} onClick={() => navigate('/meeting_screen')}>Meeting</button>
      <button style={buttonStyle} onClick={() => navigate('/attendance')}>Attendance</button>
    </div>
  );
};

export default NavBar;
