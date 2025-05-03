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
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
  <div style={{ 
    backgroundColor: '#e1effa', 
    padding: '30px', 
    borderRadius: '10px', 
    width: '400px', 
    border: '1px solid #ccc',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  }}>
    <h2 style={{ textAlign: 'center' }}>Create Meeting Note</h2>
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Title:</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginTop: '5px'
          }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Content:</label><br />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginTop: '5px',
            resize: 'none'
          }}
        />
      </div>
      <button 
        type="submit"
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '8px 20px',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Save Note
      </button>
    </form>
  </div>
</div>
  );
};

export default MinuteCreate;
