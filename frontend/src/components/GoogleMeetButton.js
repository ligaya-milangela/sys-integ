import React from 'react';

const GoogleMeetButton = () => {
  const handleCreateMeeting = () => {
    // Redirect to the backend to start OAuth and meeting creation
    window.location.href = 'http://localhost:5003/auth/google';
  };

  return (
    <button onClick={handleCreateMeeting}>
      Create Google Meet
    </button>
  );
};

export default GoogleMeetButton;
