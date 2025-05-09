import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getNotes, deleteNote } from '../../services/notesService';
import background from '../../assets/background.png';

const MeetingScreen = () => {
  const [meetingNotes, setMeetingNotes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMeetingNotes = async () => {
    try {
      const response = await getNotes();
      const meetingNotes = response.data.filter(note => note.isMinute === true && note.isApproved === true);
      setMeetingNotes(meetingNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    fetchMeetingNotes();
  }, [location]);

  const handleNoteClick = (noteId) => {
    navigate(`/minute_note_detail/${noteId}`);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      overflowY: 'auto',
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            color: '#f8fafc',
            fontSize: '2rem',
            fontWeight: '600',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Approved Meeting Minutes
          </h1>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/minute_create')}
              style={{
                backgroundColor: 'rgb(18, 52, 88)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                ':hover': {
                  backgroundColor: '#2563eb',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }
              }}
            >
              Create New Minute
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'rgba(51, 65, 85, 0.7)',
                color: 'rgba(248, 250, 252, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: 'rgba(51, 65, 85, 0.9)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {meetingNotes.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(248, 250, 252, 0.7)',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>No approved meeting minutes found</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            {meetingNotes.map(note => (
              <div
                key={note._id}
                onClick={() => handleNoteClick(note._id)}
                style={{
                  backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 8px 15px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <h3 style={{
                  color: '#f8fafc',
                  marginTop: 0,
                  marginBottom: '1rem',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {note.title}
                </h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'rgba(248, 250, 252, 0.6)',
                  fontSize: '0.85rem',
                  marginTop: '1.5rem'
                }}>
                  <span>{formatDate(note.createdAt)}</span>
                  <span style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}>
                    Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingScreen;