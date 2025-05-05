import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttendanceForm = () => {
  const [meetingDate, setMeetingDate] = useState('');
  const [attendees, setAttendees] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const attendanceData = {
      meeting_date: meetingDate,
      attendees: attendees.split(',').map((att) => att.trim()),
      created_by: createdBy,
    };

    console.log("Submitting attendance data:", attendanceData);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/attendance/create`, attendanceData);
      console.log("Attendance created:", response.data);
      setSuccessMessage('Attendance created successfully!'),

      setTimeout(() => {
        navigate('/attendance/list');
      }, 1500);

    } catch (error) {
      console.error('Error submitting attendance:', error.response ? error.response.data : error.message);
      setError('Failed to create attendance: ' + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
  <div style={{
    backgroundColor: '#e1effa',
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    border: '1px solid #ccc',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  }}>
    <h2 style={{ textAlign: 'center' }}>Create Attendance</h2>
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Meeting Date:</label><br />
        <input
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginTop: '5px'
          }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Attendees (comma separated):</label><br />
        <input
          type="text"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginTop: '5px'
          }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Created By:</label><br />
        <input
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginTop: '5px'
          }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <button
        type="submit"
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '8px 20px',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          width: '100%',
          marginTop: '10px'
        }}
      >
        Submit Attendance
      </button>
    </form>
  </div>
</div>

  );
};

export default AttendanceForm;
