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
        const response = await axios.get(`http://localhost:5003/api/attendance/details/${id}`);
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
      <div>
        <h2>Attendance Details</h2>
        <p><strong>ID:</strong> {attendance._id}</p>
        <p><strong>Date:</strong> {new Date(attendance.meeting_date).toLocaleDateString()}</p>
        <p><strong>Attendees:</strong>  </p>
        <ul>
          {attendance.attendees.map((attendee, index) => (
            <li key={index}>{attendee.name}</li>  // Display the names of attendees
          ))}
        </ul>
       
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default AttendanceDetails;
