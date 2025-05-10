import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote } from '../../services/notesService';
import { getAllUsers } from '../../services/userService';
import background from '../../assets/background.png';

const MinuteNoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const navigate = useNavigate();

  // Fetch note and users
  useEffect(() => {
    const fetchNoteAndUsers = async () => {
      try {
        const noteResponse = await getNoteById(id);
        const usersResponse = await getAllUsers();

        // Sort users alphabetically by first name
        const sortedUsers = usersResponse.data.users.sort((a, b) => 
          a.firstName.localeCompare(b.firstName)
        );

        setNote(noteResponse.data);
        setEditedContent(noteResponse.data.content);
        setUsers(sortedUsers);

        if (noteResponse.data.attendees) {
          const attendeeIds = noteResponse.data.attendees.map(String);
          setSelectedAttendees(attendeeIds);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchNoteAndUsers();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateNote(id, { 
        content: editedContent,
        attendees: selectedAttendees 
      });
      const updatedNote = await getNoteById(id);
      setNote(updatedNote.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        navigate('/meeting_screen');
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const handleAttendeeChange = (userId) => {
    if (!isEditing) return; // Only allow changes in edit mode
    const idStr = String(userId);
    setSelectedAttendees((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  };

  const handleMarkAll = () => {
    if (!isEditing) return; // Only allow changes in edit mode
    if (selectedAttendees.length === users.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(users.map((user) => String(user.id)));
    }
  };

  const handleBack = () => {
    navigate('/meeting_screen');
  };

  if (!note || !users.length) return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#f8fafc'
    }}>
      Loading...
    </div>
  );

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
      overflow: 'hidden'
    }}>
      {/* Blurred background overlay */}
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
      
      {/* Content container */}
      <div style={{
        position: 'relative',
        height: 'calc(100vh - 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        boxSizing: 'border-box',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Back button - now properly sized */}
        <button
          onClick={handleBack}
          style={{
            backgroundColor: 'rgba(51, 65, 85, 0.7)',
            color: 'rgba(248, 250, 252, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '0.5rem 1rem', // Reduced padding
            fontSize: '0.9rem', // Smaller font size
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '1.5rem',
            display: 'inline-flex', // Changed to inline-flex
            alignItems: 'center',
            gap: '0.5rem',
            width: 'fit-content', // Ensures button only takes needed space
            ':hover': {
              backgroundColor: 'rgba(51, 65, 85, 0.9)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          ← Back to Meeting Notes
        </button>

        {/* Header section */}
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
            fontSize: '1.8rem',
            fontWeight: '600',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {note.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                backgroundColor: isEditing ? 'rgba(51, 65, 85, 0.7)' : 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: isEditing ? 'rgba(51, 65, 85, 0.9)' : '#2563eb',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>
            
            {/* Changed Delete to Save Changes when editing */}
            {isEditing ? (
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: '#2563eb',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: 'rgba(185, 28, 28, 0.9)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '2rem',
          flex: 1,
          minHeight: 0
        }}>
          {/* Left panel - Content */}
          <div style={{
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'relative',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem'
            }}>
              <h2 style={{
                color: '#f8fafc',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: 0
              }}>
                Meeting Minutes
              </h2>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #3b82f6, #2563eb)'
              }} />
            </div>
            
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  flex: 1,
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  lineHeight: '1.6',
                  resize: 'none',
                  fontFamily: 'inherit',
                  '::placeholder': {
                    color: 'rgba(248, 250, 252, 0.5)'
                  }
                }}
              />
            ) : (
              <div style={{
                flex: 1,
                color: 'rgba(248, 250, 252, 0.9)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                paddingRight: '0.5rem',
                '::-webkit-scrollbar': {
                  width: '8px'
                },
                '::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '4px'
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(148, 163, 184, 0.5)',
                  borderRadius: '4px',
                  ':hover': {
                    backgroundColor: 'rgba(148, 163, 184, 0.7)'
                  }
                }
              }}>
                {note.content}
              </div>
            )}
          </div>

          {/* Right panel - Attendees */}
          <div style={{ 
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'relative',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem'
            }}>
              <h2 style={{ 
                color: '#f8fafc',
                fontSize: '1.25rem',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: 0
              }}>
                Attendees
              </h2>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #3b82f6, #2563eb)'
              }} />
            </div>

            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              paddingRight: '0.5rem',
              '::-webkit-scrollbar': {
                width: '8px'
              },
              '::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                borderRadius: '4px'
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(148, 163, 184, 0.5)',
                borderRadius: '4px',
                ':hover': {
                  backgroundColor: 'rgba(148, 163, 184, 0.7)'
                }
              }
            }}>
              <ul style={{ 
                listStyleType: 'none', 
                padding: 0,
                display: 'grid',
                gap: '0.5rem'
              }}>
                {users.map((user) => (
                  <li 
                    key={user.id} 
                    onClick={() => handleAttendeeChange(user.id)}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: selectedAttendees.includes(String(user.id)) 
                        ? 'rgba(59, 130, 246, 0.2)' 
                        : 'rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease',
                      cursor: isEditing ? 'pointer' : 'default',
                      ':hover': {
                        backgroundColor: isEditing 
                          ? selectedAttendees.includes(String(user.id))
                            ? 'rgba(59, 130, 246, 0.3)'
                            : 'rgba(255,255,255,0.1)'
                          : undefined
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(String(user.id))}
                      onChange={() => handleAttendeeChange(user.id)}
                      style={{ 
                        marginRight: '1rem',
                        width: '18px',
                        height: '18px',
                        cursor: isEditing ? 'pointer' : 'default',
                        accentColor: '#3b82f6',
                        opacity: isEditing ? 1 : 0.5,
                        pointerEvents: isEditing ? 'auto' : 'none'
                      }}
                    />
                    <span style={{ 
                      color: selectedAttendees.includes(String(user.id)) 
                        ? '#f8fafc' 
                        : 'rgba(248, 250, 252, 0.7)',
                      fontWeight: selectedAttendees.includes(String(user.id)) ? '500' : 'normal'
                    }}>
                      {user.firstName} {user.lastName}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinuteNoteDetail;