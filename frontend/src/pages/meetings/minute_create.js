import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notesService';

const MinuteCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating note...');
    try {
      const noteData = {
        title,
        content,
        isMinute: true,
      };

      console.log('Note Data:', noteData);

      const response = await createNote(noteData);
      console.log('Note created:', response); 

      navigate('/meeting_screen');
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  return (
    <div>
      <h2>Create Meeting Note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label><br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>
        <button type="submit">Save Note</button>
      </form>
    </div>
  );
};

export default MinuteCreate;
