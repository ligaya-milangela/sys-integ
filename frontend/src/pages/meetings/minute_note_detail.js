import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotes, updateNote } from '../../services/notesService';

const MinuteNoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNotes();
        const foundNote = response.data.find(note => note._id === id);
        setNote(foundNote);
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

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <button onClick={handleSubmitForApproval}>Send for Approval</button>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default MinuteNoteDetail;
