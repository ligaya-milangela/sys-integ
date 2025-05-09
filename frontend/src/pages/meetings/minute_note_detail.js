import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote } from '../../services/notesService';
import { getAllUsers } from '../../services/userService';

const MinuteNoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const navigate = useNavigate();

  // Fetch note and users
  useEffect(() => {
    const fetchNoteAndUsers = async () => {
      try {
        const noteResponse = await getNoteById(id);
        const usersResponse = await getAllUsers();

        setNote(noteResponse.data);
        setUsers(usersResponse.data.users);

        if (noteResponse.data.attendees) {
          // Ensure all IDs are strings for consistent comparison
          const attendeeIds = noteResponse.data.attendees.map(String);
          setSelectedAttendees(attendeeIds);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchNoteAndUsers();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateNote(id, { attendees: selectedAttendees });
      alert('Note updated successfully!');
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleAttendeeChange = (userId) => {
    const idStr = String(userId);
    setSelectedAttendees((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  };

  const handleMarkAll = () => {
    if (selectedAttendees.length === users.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(users.map((user) => String(user.id)));
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!note || !users.length) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <button
        onClick={handleBack}
        style={{
          backgroundColor: '#c9c9c9',
          padding: '6px 12px',
          border: 'none',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{note.title}</h1>

      <p
        style={{
          backgroundColor: '#e0ecff',
          padding: '20px',
          borderRadius: '10px',
          fontStyle: 'italic',
          minWidth: '400px',
          minHeight: '100px',
          width: 'fit-content',
          maxWidth: '600px',
          marginBottom: '20px'
        }}
      >
        {note.content}
      </p>

      <h3 style={{ marginTop: '20px' }}>Attendees:</h3>
      <button
        onClick={handleMarkAll}
        style={{
          marginBottom: '10px',
          padding: '6px 12px',
          backgroundColor: '#b4d8f7',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        {selectedAttendees.length === users.length ? 'Unmark All' : 'Mark All'}
      </button>

      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: '10px' }}>
            <label style={{ fontStyle: 'italic' }}>
              <input
                type="checkbox"
                checked={selectedAttendees.includes(String(user.id))}
                onChange={() => handleAttendeeChange(user.id)}
                style={{ marginRight: '10px' }}
              />
              {user.firstName} {user.lastName}
            </label>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#d9d9d9',
            border: 'none',
            borderRadius: '10px',
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MinuteNoteDetail;
