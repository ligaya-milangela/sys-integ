import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AttendanceDetails = () => {
  const { id } = useParams();  // Using useParams to get ID from URL
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetching the attendance details using the ID from the URL
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/details/${id}`);
        setAttendance(response.data);  // Setting the data in the state
      } catch (error) {
        console.error('Failed to fetch attendance details:', error);
        setError(error);
      }
    };

    if (id) {
      fetchAttendance();  // Fetch the attendance details if the ID is available
    }
  }, [id]);  // Re-run the effect if the ID changes

  // Display error message if an error occurs
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  // Render the attendance details if data is available
  if (attendance) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Attendance Details</h1>
    
      <div style={{
        backgroundColor: '#e0ecff',
        padding: '20px',
        borderRadius: '10px',
        fontStyle: 'italic',
        minWidth: '400px',
        minHeight: '100px',
        width: 'fit-content',
        maxWidth: '600px',
        marginBottom: '20px'
      }}>
        <p><strong>ID:</strong> {attendance._id}</p>
        <p><strong>Date:</strong> {new Date(attendance.meeting_date).toLocaleDateString()}</p>
        <p><strong>Attendees:</strong></p>
    
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontStyle: 'italic' }}>
          {attendance.attendees.length === 0 ? (
            <li>No attendees yet.</li>
          ) : (
            attendance.attendees.map((attendee, index) => (
              <li key={index}>{attendee.name}</li> // Display the names of attendees
            ))
          )}
        </ul>
      </div>
    </div>     
    );
  }

  return <div>Loading...</div>;
};

export default AttendanceDetails;
