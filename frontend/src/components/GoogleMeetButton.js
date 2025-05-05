import React from 'react';

const GoogleMeetButton = () => {
  const handleCreateMeeting = () => {
    // Redirect to the backend to start OAuth and meeting creation
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div style={{ padding: '2rem' }}>
  {/* <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Google Meet</h1> */}

  <button
    onClick={handleCreateMeeting}
    style={{
      backgroundColor: '#add8f7', 
      color: 'black',
      border: 'none',
      borderRadius: '20px',
      padding: '10px 20px',
      fontSize: '1rem',
      cursor: 'pointer'
    }}
  >
    Click on Google Meet
  </button>
</div>
  );
};

export default GoogleMeetButton;
