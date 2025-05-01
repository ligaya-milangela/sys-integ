import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getNotes, deleteNote } from '../../services/notesService';

const MeetingScreen = () => {
  const [meetingNotes, setMeetingNotes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMeetingNotes = async () => {
    try {
      const response = await getNotes();
      const meetingNotes = response.data.filter(note => note.isMinute === true);
      setMeetingNotes(meetingNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    fetchMeetingNotes();
  }, [location]);

  const handleNoteClick = (noteId) => {
    navigate(`/minute_note/${noteId}`);
  };

  const handleDelete = async (e, noteId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
        setMeetingNotes(prev => prev.filter(note => note._id !== noteId));
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1>Meeting Notes</h1>
      <button onClick={() => navigate('/minute_create')}>Create New Minute Note</button>

      {meetingNotes.length === 0 ? (
        <p>No meeting notes found.</p>
      ) : (
        <ul>
          {meetingNotes.map(note => (
            <li
              key={note._id}
              onClick={() => handleNoteClick(note._id)}
              style={{ marginBottom: '1em', cursor: 'pointer', border: '1px solid gray', padding: '10px' }}
            >
              <strong>Title:</strong> {note.title}<br />
              <strong>Content:</strong> {note.content.slice(0, 100)}...<br />
              <strong>Created:</strong> {formatDate(note.createdAt)}<br />

              <button onClick={(e) => { e.stopPropagation(); navigate(`/minute_note_detail/${note._id}`); }}>
                Edit
              </button>
              <button onClick={(e) => handleDelete(e, note._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetingScreen;
