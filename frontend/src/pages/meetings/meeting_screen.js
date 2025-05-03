import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getNotes, deleteNote } from '../../services/notesService';
// import NavBar from './components/nav-bar'; 

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
    e.stopPropagation();  // Now `e` is a valid event object
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
    <div style={{ padding: '2rem' }}>
      {/* <NavBar/> */}
  <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Meeting Notes</h1>

  <button
    onClick={() => navigate('/minute_create')}
    style={{
      backgroundColor: '#add8f7',
      color: 'black',
      border: 'none',
      borderRadius: '25px',
      padding: '10px 20px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginBottom: '1.5rem'
    }}
  >
    Create New Minute Note
  </button>

  {meetingNotes.length === 0 ? (
    <p>No meeting notes found.</p>
  ) : (
    <ul style={{
      listStyleType: 'none',
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {meetingNotes.map(note => (
        <li
          key={note._id}
          onClick={() => handleNoteClick(note._id)}
          style={{
            backgroundColor: '#d3eafd',
            borderRadius: '15px',
            border: '1px solid #333',
            padding: '1rem 1.5rem',
            cursor: 'pointer',
            width: '23%',
            boxSizing: 'border-box'
          }}
        >
          <p><strong>Title:</strong> <em>{note.title}</em></p>
          <p><strong>Content:</strong> <em>{note.content.slice(0, 100)}...</em></p>
          <p><strong>Created:</strong> <em>{formatDate(note.createdAt)}</em></p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/minute_note_detail/${note._id}`);
              }}
              style={{
                backgroundColor: '#d3d3d3',
                border: 'none',
                borderRadius: '15px',
                padding: '6px 15px',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>

            <button
              onClick={(e) => handleDelete(e, note._id)}
              style={{
                backgroundColor: '#f66',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '6px 15px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


  );
};

export default MeetingScreen;
