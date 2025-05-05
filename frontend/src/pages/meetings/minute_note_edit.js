import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MinuteNoteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [note, setNote] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        console.log("Fetching note:", id);
        const response = await axios.get(`${API}/api/notes/${id}`);
        console.log("Note fetched:", response);
        setNote(response.data);
      } catch (error) {
        console.error('Failed to fetch note:', error);
      }
    };

    fetchNote();
  }, [id, API]);

  const handleSave = async () => {
    try {
      await axios.put(`${API}/api/notes/${id}`, { content: note.content });
      navigate('/meeting_screen');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleChange = (e) => {
    setNote({ ...note, content: e.target.value });
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
        <h2 style={{ textAlign: 'center' }}>Edit Minute Note</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Title:</label><br />
          <input
            type="text"
            name="title"
            value={note.title}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginTop: '5px',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Content:</label><br />
          <textarea
            name="content"
            value={note.content}
            onChange={handleChange}
            placeholder="Content"
            rows={8}
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
          onClick={handleSave}
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
          Save
        </button>
      </div>
    </div>
  );
}

export default MinuteNoteEdit;
