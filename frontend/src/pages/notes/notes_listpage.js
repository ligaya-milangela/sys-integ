import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes } from '../../services/notesService';

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);      // Always start with an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getNotes()
      .then((res) => {
        setNotes(res.data || []);              // Fallback to empty array
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch notes');
        console.error('Error fetching notes:', err);
        setLoading(false);
      });
  }, []);

  const handleCreateNote = () => {
    navigate('/create_notes');
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>All Notes</h1>
      <ul>
        {notes.map((note) => (
          <li
            key={note._id}
            onClick={() => handleNoteClick(note._id)}
            style={{ cursor: 'pointer', marginBottom: '1rem' }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleCreateNote}>Create New Note</button>
    </div>
  );
};

export default NotesListPage;
