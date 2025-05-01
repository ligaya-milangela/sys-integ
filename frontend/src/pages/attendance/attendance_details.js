import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AttendanceDetails = () => {
  const { id } = useParams();
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
console.log(AttendanceDetails);
useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const currentUrl = window.location.href;
      const attendanceId = currentUrl.split('/').pop();
      console.log(attendanceId);

      const response = await axios.get(`http://localhost:5003/api/attendance/details/${attendanceId}`);
      console.log(response.data);

      setAttendance(response.data); 
    } catch (error) {
      console.error('Failed to fetch attendance details:', error);
      setError(error);
    }
  };

  if (id) {
    fetchAttendance();
  }
}, [id]);


  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (attendance)

  return (
    <div>
      <h2>Attendance Details</h2>
      <p><strong>ID:</strong> {attendance._id}</p>
      <p><strong>Date:</strong> {new Date(attendance.meeting_date).toLocaleDateString()}</p>
      <p><strong>Attendees:</strong> {attendance.attendees.join(', ')}</p>
    </div>
  );
};

export default AttendanceDetails;
