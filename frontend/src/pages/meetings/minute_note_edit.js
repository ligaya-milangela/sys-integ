import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MinuteNoteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState({ title: '', content: '' });

  useEffect(() => {
  const fetchNote = async () => {
    try {
      console.log(id);
      const response = await axios.get(`/api/notes/${id}`);
      console.log(response);
      setNote(response.data);
    } catch (error) {
      console.error('Failed to fetch note:', error);
    }
  };

  fetchNote();
}, [id]);


  const handleSave = async () => {
    try {
      await axios.put(`/api/notes/${id}`, { content: note.content });
      navigate('/meeting_screen');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleChange = (e) => {
    setNote({ ...note, content: e.target.value });
  };

  return (
    <div>
      <h2>Edit Minute Note</h2>
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={note.title}
        readOnly
      />
      <br />
      <label>Content:</label>
      <textarea
        name="content"
        value={note.content}
        onChange={handleChange}
        placeholder="Content"
      />
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default MinuteNoteEdit;
