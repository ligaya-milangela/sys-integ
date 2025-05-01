import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/attendance/list');
        setAttendances(response.data);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
    };
    fetchAttendances();
  }, []);

  return (
    <div>
      <h2>Attendance List</h2>
      <button 
        onClick={() => navigate('/attendance/create')} 
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Add Attendance
      </button>
      <ul>
        {attendances.map((attendance) => (
          <li
            key={attendance._id}
            onClick={() => navigate(`/attendance/details/${attendance._id}`)}
            style={{ cursor: 'pointer', color: 'blue', marginBottom: '10px' }}
          >
            {new Date(attendance.meeting_date).toLocaleDateString()} - {(attendance.attendees || []).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
