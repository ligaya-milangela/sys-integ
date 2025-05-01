import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notesService';

const CreateNotePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('notes');  // Category (Notes or Meeting)
  const navigate = useNavigate();

  const handleSubmit = async (e, category) => {
    e.preventDefault();
    if (!title || !content) {
      console.error("Title and content cannot be empty.");
      return;
    }
    try {
      const isMinute = category === 'meeting'; // Set isMinute to true only for meeting category
      const response = await createNote({ title, content, isMinute });
  
      console.log('Response from API:', response.data);  // Check the response
  
      if (category === 'notes') {
        navigate('/'); // Navigate to Notes screen
      }
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  return (
    <div>
      <h1>Create Note</h1>
      <form>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={(e) => handleSubmit(e, 'notes')}>Save to Notes</button>
      </form>
    </div>
  );
};

export default CreateNotePage;
