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
      const response = await axios.post('http://localhost:5003/api/attendance/create', attendanceData);
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
    <div>
      <h2>Create Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Meeting Date:</label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Attendees (comma separated):</label>
          <input
            type="text"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Created By:</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AttendanceForm;
