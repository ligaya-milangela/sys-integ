import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notesService';
import axios from 'axios';
import background from '../../assets/background.png';

const MinuteCreate = () => {
  const [form, setForm] = useState({ 
    title: '', 
    content: '' 
  });
  const [isFocused, setIsFocused] = useState({
    title: false,
    content: false
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      title: form.title.trim(),
      content: form.content.trim(),
      isMinute: true,
      attendees: null,
    };

    try {
      const createdNote = await createNote(noteData);

      if (!createdNote || !createdNote._id) {
        throw new Error('Note ID not returned from server');
      }

      await axios.post('https://express-auro.onrender.com/api/ticket/create/mnas', {
        reference_id: createdNote._id,
        title: createdNote.title,
      });

      setForm({ title: '', content: '' });
      navigate('/meeting_screen');

    } catch (err) {
      console.error('Error during note creation or ticket fetch:', err);
      alert(err.response?.data?.message || 'Failed to create note or send to ticket API.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 0
      }} />
      
      <form onSubmit={handleSubmit} style={{
        position: 'relative',
        width: '90%',
        maxWidth: '600px',
        padding: '2.5rem',
        borderRadius: '12px',
        backgroundColor: 'rgba(51, 65, 85, 0.7)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 1
      }}>
        <h2 style={{
          color: '#f8fafc',
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.75rem',
          fontWeight: '600'
        }}>Create Meeting Note</h2>
        
        <div style={{ 
          position: 'relative',
          marginBottom: '2rem'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#3b82f6',
            zIndex: 2,
            transform: isFocused.title ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          }} />
          <input 
            type="text" 
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            onFocus={() => setIsFocused({...isFocused, title: true})}
            onBlur={() => setIsFocused({...isFocused, title: form.title.length > 0})}
            required
            style={{
              width: '100%',
              padding: '0.5rem 0',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: 'none',
              color: '#f8fafc',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          <label style={{
            position: 'absolute',
            left: 0,
            top: isFocused.title || form.title.length > 0 ? '-1.25rem' : '0.5rem',
            color: isFocused.title ? '#3b82f6' : 'rgba(248, 250, 252, 0.7)',
            fontSize: isFocused.title || form.title.length > 0 ? '0.75rem' : '1rem',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }}>
            Title
          </label>
        </div>
        
        <div style={{ 
          position: 'relative',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#3b82f6',
            zIndex: 2,
            transform: isFocused.content ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          }} />
          <textarea 
            value={form.content}
            onChange={(e) => setForm({...form, content: e.target.value})}
            onFocus={() => setIsFocused({...isFocused, content: true})}
            onBlur={() => setIsFocused({...isFocused, content: form.content.length > 0})}
            required
            style={{
              width: '100%',
              height: '200px',
              padding: '0.5rem 0',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
              lineHeight: '1.5',
              transition: 'all 0.3s ease'
            }}
          />
          <label style={{
            position: 'absolute',
            left: 0,
            top: isFocused.content || form.content.length > 0 ? '-1.25rem' : '0.5rem',
            color: isFocused.content ? '#3b82f6' : 'rgba(248, 250, 252, 0.7)',
            fontSize: isFocused.content || form.content.length > 0 ? '0.75rem' : '1rem',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }}>
            Content
          </label>
        </div>
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '1rem',
            ':hover': {
              backgroundColor: '#2563eb',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            },
            ':active': {
              transform: 'translateY(0)'
            }
          }}
        >
          Save Meeting Note
        </button>
      </form>
    </div>
  );
};

export default MinuteCreate;