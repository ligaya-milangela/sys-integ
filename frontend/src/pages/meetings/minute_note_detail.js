import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote } from '../../services/notesService';
import { getAttendanceById } from '../../services/attendanceService';

const MinuteNoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeeIdInput, setAttendeeIdInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        console.log(id)
        const response = await getNoteById(id);
        setNote(response.data);
        if (response.data.attendees) {
          setAttendees(response.data.attendees);
        }
      } catch (err) {
        console.error('Error fetching note:', err);
      }
    };

    fetchNote();
  }, [id]);

  const handleEdit = () => {
    navigate(`/minute_note_edit/${id}`);
  };

  const handleSubmitForApproval = async () => {
    try {
      await updateNote(id, { submitted: true });
      alert('Note submitted for approval!');
    } catch (err) {
      console.error('Error submitting note:', err);
    }
  };
  const handleAddAttendee = async () => {
    try {
      const response = await getAttendanceById(attendeeIdInput);
      const attendance = response.data;
  
      if (!attendance.attendees || attendance.attendees.length === 0) {
        alert('No attendees found in this attendance record.');
        return;
      }
  
      // Merge existing attendees with new ones, avoid duplicates
      const newAttendees = attendance.attendees;
      const updatedAttendeesMap = new Map();
      [...attendees, ...newAttendees].forEach(att => {
        const id = att._id || att; // fallback if att is still just an ID
        updatedAttendeesMap.set(id.toString(), att);
      });
      setAttendees(Array.from(updatedAttendeesMap.values()));

  
      setAttendeeIdInput('');
    } catch (err) {
      alert('Attendance record not found with that ID');
      console.error('Error fetching attendance:', err);
    }
  };
  
  const handleSaveAttendees = async () => {
    try {
      const updatedNote = { attendees };
      await updateNote(id, updatedNote);
      alert('Attendees saved successfully!');
    } catch (err) {
      console.error('Error saving attendees:', err);
      alert('Failed to save attendees.');
    }
    location.reload()
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>

      <h3>Attendees</h3>
      <ul>
        {attendees.length === 0 ? (
          <li>No attendees yet.</li>
        ) : (
          attendees.map((attendee) => (
            <li key={attendee._id || attendee}>
              {attendee.name || attendee.toString()}
            </li>
          ))
        )}
      </ul>

      <input
        type="text"
        value={attendeeIdInput}
        onChange={(e) => setAttendeeIdInput(e.target.value)}
        placeholder="Enter Attendance Record ID"
      />
      <button onClick={handleAddAttendee}>Add Attendees from ID</button>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSaveAttendees}>Save Attendees</button>
        <button onClick={handleSubmitForApproval}>Send for Approval</button>
        <button onClick={handleEdit}>Edit</button>
      </div>
    </div>
  );
};

export default MinuteNoteDetail;
