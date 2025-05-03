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
  <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
  <h1 style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{note.title}</h1>

  <p style={{
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
    {note.content}
  </p>

  <div style={{ marginTop: '10px' }}>
    <label htmlFor="attendeeId" style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>
      Enter Attendance ID
    </label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        id="attendeeId"
        type="text"
        value={attendeeIdInput}
        onChange={(e) => setAttendeeIdInput(e.target.value)}
        placeholder=""
        style={{
          padding: '6px 12px',
          borderRadius: '15px',
          border: '1px solid #ccc',
          fontSize: '14px'
        }}
      />
      <button
        onClick={handleAddAttendee}
        style={{
          backgroundColor: '#7fe086',
          border: 'none',
          borderRadius: '5px',
          padding: '6px 12px',
          cursor: 'pointer',
          outline: '2px solid purple'
        }}
      >
        Add
      </button>
    </div>
  </div>

  <h3 style={{ marginTop: '20px' }}>Attendees:</h3>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontStyle: 'italic' }}>
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

  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
    <button
      onClick={handleEdit}
      style={{
        backgroundColor: '#d9d9d9',
        border: 'none',
        borderRadius: '10px',
        padding: '6px 12px',
        cursor: 'pointer'
      }}
    >
      Edit
    </button>

    <button
      onClick={handleSubmitForApproval}
      style={{
        backgroundColor: '#b4d8f7',
        border: 'none',
        borderRadius: '10px',
        padding: '6px 12px',
        cursor: 'pointer'
      }}
    >
      Send for Approval
    </button>

    <button
      onClick={handleSaveAttendees}
      style={{
        backgroundColor: '#63d374',
        border: 'none',
        borderRadius: '10px',
        padding: '6px 12px',
        cursor: 'pointer'
      }}
    >
      Save Changes
    </button>
  </div>
</div>

  );
};

export default MinuteNoteDetail;
