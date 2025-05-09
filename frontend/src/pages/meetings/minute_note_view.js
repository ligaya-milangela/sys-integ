import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById } from '../../services/notesService';
import { getAllUsers } from '../../services/userService';

const MinuteNoteView = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const noteResponse = await getNoteById(id);
        const usersResponse = await getAllUsers();

        const allUsers = usersResponse.data.users;
        const attendeeIds = noteResponse.data.attendees?.map(String) || [];

        const attendeeList = allUsers.filter(user =>
          attendeeIds.includes(String(user.id))
        );

        setNote(noteResponse.data);
        setAttendees(attendeeList);
      } catch (err) {
        console.error('Error loading note/view:', err);
      }
    };

    fetchNoteData();
  }, [id]);

  const handleBack = () => navigate(-1);

  if (!note) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <button
        onClick={handleBack}
        style={{
          backgroundColor: '#d3d3d3',
          padding: '6px 12px',
          border: 'none',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{note.title}</h1>

      <p
        style={{
          backgroundColor: '#f0f8ff',
          padding: '20px',
          borderRadius: '10px',
          fontStyle: 'italic',
          width: 'fit-content',
          maxWidth: '600px',
          marginBottom: '20px',
        }}
      >
        {note.content}
      </p>

      <h3>Attendees:</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {attendees.length > 0 ? (
          attendees.map((user) => (
            <li key={user.id} style={{ marginBottom: '8px', fontStyle: 'italic' }}>
              ✅ {user.firstName} {user.lastName}
            </li>
          ))
        ) : (
          <li style={{ fontStyle: 'italic' }}>No attendees recorded.</li>
        )}
      </ul>
    </div>
  );
};

export default MinuteNoteView;
