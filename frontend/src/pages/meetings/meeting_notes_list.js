import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, getTicketStatus } from '../../services/notesService';
import background from '../../assets/background.png';

function MeetingNotesList() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await getNotes();
        const allNotes = response.data;

        const notesWithStatus = await Promise.all(
          allNotes.map(async (note) => {
            try {
              const statusRes = await getTicketStatus(note._id);
              console.log(statusRes);
              const ticketData = statusRes.data.ticket[0] || {};
              const ticketStatus = ticketData.status || 'Unavailable';
              const remarks = ticketData.remarks || ''; //for remarks once the field is available
              return { ...note, ticketStatus, remarks };
            } catch (err) {
              return { ...note, ticketStatus: 'Unavailable', remarks: '' };
            }
          })
        );

        const filtered = notesWithStatus.filter(
          (note) => note.ticketStatus === 'Declined' || note.ticketStatus === 'For Approval'
        );

        setNotes(filtered);
      } catch (error) {
        setError('Failed to fetch notes. Please try again later.');
        console.error('Failed to fetch notes:', error);
      }
    }

    fetchNotes();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        padding: '20px',
      }}
    >
      <button
        onClick={() => navigate('/meeting_screen')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        ← Back to Meeting Screen
      </button>

      <h2>Declined & For Approval Notes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notes.length === 0 ? (
        <p>No declined or pending notes available.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li
              key={note._id}
              onClick={() => navigate(`/minute_note_detail/${note._id}`)}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
            >
              <strong>{note.title}</strong> - <em>{note.ticketStatus}</em>
              {note.remarks && (
                <div style={{ fontStyle: 'italic', color: 'gray' }}>
                  Remarks: {note.remarks}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeetingNotesList;
