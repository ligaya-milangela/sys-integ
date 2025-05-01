import React, { useEffect, useState } from 'react';
import { getNotes } from '../../services/notesService';
import { useNavigate } from 'react-router-dom';

const MinuteNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNotes()
      .then(res => {
        const minutes = res.data.filter(note => note.isMinute);
        setNotes(minutes);  // Filter meeting notes only
      })
      .catch(err => console.error(err));
  }, []);

  const handleView = (noteId) => {
    navigate(`/minute_note/${noteId}`);  // Navigate to the detailed view of the note
  };

  return (
    <div>
      <h1>Minute Notes</h1>
      {notes.length === 0 ? (
        <p>No meeting notes found.</p>
      ) : (
        notes.map(note => (
          <div key={note._id}>
            <h3>{note.title}</h3>
            <button onClick={() => handleView(note._id)}>View</button>  {/* View button */}
          </div>
        ))
      )}
    </div>
  );
};

export default MinuteNotesPage;
