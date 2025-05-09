import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notesService';

const MinuteCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [markAll, setMarkAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users.');
      });
  }, []);

  const handleAttendeeChange = (userId) => {
    setAttendees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleMarkAll = () => {
    if (markAll) {
      setAttendees([]);
    } else {
      setAttendees(users.map((user) => user.id));
    }
    setMarkAll(!markAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      isMinute: true,
      attendees: attendees,
    };

    try {
      const response = await createNote(noteData);
      console.log('Note created:', response);

      setTitle('');
      setContent('');
      setAttendees([]);
      setMarkAll(false);

      navigate('/meeting_screen');
    } catch (err) {
      console.error('Error creating note:', err);
      alert('Failed to create note. Check console for details.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div
        style={{
          backgroundColor: '#e1effa',
          padding: '30px',
          borderRadius: '10px',
          width: '400px',
          border: '1px solid #ccc',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Create Meeting Note</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Title:</label>
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
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '5px',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Attendees:</label>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={markAll}
                  onChange={handleMarkAll}
                  style={{ marginRight: '8px' }}
                />
                Mark All
              </label>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {users.map((user) => (
                <label key={user.id} style={{ display: 'block', marginBottom: '5px' }}>
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={attendees.includes(user.id)}
                    onChange={() => handleAttendeeChange(user.id)}
                    style={{ marginRight: '8px' }}
                  />
                  {user.firstName} {user.lastName}
                </label>
              ))}
            </div>
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
              fontWeight: 'bold',
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
