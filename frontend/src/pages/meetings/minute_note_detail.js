import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote } from '../../services/notesService';

const MinuteNoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNoteById(id);
        console.log("Fetched note:", response.data); 
        setNote(response.data);
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

  if (!note) {
    return <div>Loading...</div>;
  }

  const attendeesList = Array.isArray(note.attendees)
    ? note.attendees
    : [];

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

      <h3 style={{ marginTop: '20px' }}>Attendees:</h3>
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontStyle: 'italic' }}>
        {attendeesList.length > 0 ? (
          attendeesList.map((attendee, index) => (
            <li key={index}>{attendee}</li>
          ))
        ) : (
          <li>No attendees listed!!!</li>
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
      </div>
    </div>
  );
};

export default MinuteNoteDetail;
