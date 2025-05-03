import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { deleteAttendance} from '../../services/attendanceService';

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

  const handleDelete = async (e, attendanceId) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to remove this attendance date?")) {
      try{
        await deleteAttendance(attendanceId);
        setAttendances(prev => prev.filter(attendance => attendance._id !== attendanceId));
      } catch (err) {
        console.error("Failed to delete", err)
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '10px' }}>Attendance</h2>

      <button 
        onClick={() => navigate('/attendance/create')} 
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#b4d8f7',
          color: 'black',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Add Attendance
      </button>

      <ul style={{ paddingLeft: '20px', fontStyle: 'italic' }}>
        {attendances.map((attendance) => (
          <li
            key={attendance._id}
            onClick={() => navigate(`/attendance/details/${attendance._id}`)}
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'flex-start',  // Ensure items are aligned from the start
              alignItems: 'center',
              padding: '5px 0' // Add some padding for better spacing
            }}
          >
            <button
              onClick={(e) => handleDelete(e, attendance._id)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '5px 10px',
                cursor: 'pointer',
                marginRight: '10px' // Space between the button and the date
              }}
            >
              X
            </button>
            {new Date(attendance.meeting_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
