import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote } from '../../services/notesService';
import Swal from 'sweetalert2';
import { getAllUsers } from '../../services/userService';
import axios from 'axios';

const MinuteNoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [originalAttendees, setOriginalAttendees] = useState([]);
  const [originalContent, setOriginalContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoteAndUsers = async () => {
      try {
        const noteResponse = await getNoteById(id);
        const usersResponse = await getAllUsers();

        const sortedUsers = usersResponse.data.users.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );

        setNote(noteResponse.data);
        setEditedContent(noteResponse.data.content);
        setOriginalContent(noteResponse.data.content); // Save original content
        setUsers(sortedUsers);

        if (noteResponse.data.attendees) {
          const attendeeIds = noteResponse.data.attendees.map(String);
          setSelectedAttendees(attendeeIds);
          setOriginalAttendees(attendeeIds); // Save original attendees
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
    Swal.fire({
          icon: 'success',
          title: 'Note Saved!',
          text: 'Meeting note successfully saved.',
          confirmButtonColor: '#3085d6'
        });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this note?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });



    if (result.isConfirmed) {
      try {
        await deleteNote(id);
        await axios.post('https://express-auro.onrender.com/api/ticket/delete', {
        reference_id: id, 
      });
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Meeting note deleted successfully.',
          confirmButtonColor: '#3085d6'
        });
        navigate('/meeting_screen');
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const handleAttendeeChange = (userId) => {
    if (!isEditing) return;
    const idStr = String(userId);
    setSelectedAttendees((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  };

  const handleMarkAll = () => {
    if (!isEditing) return;
    if (selectedAttendees.length === users.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(users.map((user) => String(user.id)));
    }
  };

  const handleBack = () => {
    navigate('/meeting_screen');
  };

  const handleEdit = () => {
    setOriginalAttendees(selectedAttendees);
    setOriginalContent(editedContent);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedAttendees(originalAttendees);
    setEditedContent(originalContent);
    setIsEditing(false);
  };

  if (!note || !users.length) return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#141414',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#141414',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden'
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
        height: 'calc(100vh - 4rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        boxSizing: 'border-box',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <button
          onClick={handleBack}
          style={{
            backgroundColor: 'rgba(51, 65, 85, 0.7)',
            color: 'rgba(248, 250, 252, 0.9)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'fit-content',
            ':hover': {
              backgroundColor: 'rgba(51, 65, 85, 0.9)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          ←  Return
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 className="wave-text" style={{
            margin: 0,
            fontWeight: '600',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            gap: '0.2rem',
            color: 'white',
          }}>
            {note.title.split('').map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                {char === ' ' ? '\u00A0' : char} {/* Handle spaces */}
              </span>
            ))}
          </h1>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    backgroundColor: 'rgba(51, 65, 85, 0.7)',
                    color: 'white',
                    border: 'none',
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
                  Cancel Edit
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: '#4973ff',
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
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  style={{
                    backgroundColor: '#4973ff',
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
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    backgroundColor: 'rgb(142, 22, 22)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      backgroundColor: 'rgb(142, 22, 22)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '2rem',
          flex: 1,
          minHeight: 0
        }}>
          <div style={{
            backgroundColor: 'transparent',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <h2 style={{
              color: '#f8fafc',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginTop: 0,
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '0.75rem'
            }}>
              Meeting Minutes
            </h2>

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
              <div
                className="minute-note-detail-scroll"
                style={{
                  flex: 1,
                  color: 'rgba(248, 250, 252, 0.9)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  paddingRight: '0.5rem',
                }}
              >
                {note.content}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: 'transparent',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '0.75rem'
            }}>
              <h2 style={{
                color: '#f8fafc',
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0
              }}>
                Attendees
              </h2>

              {isEditing && (
                <button
                  onClick={handleMarkAll}
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#93c5fd',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.4)'
                    }
                  }}
                >
                  {selectedAttendees.length === users.length ? 'Unselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div
              className="minute-note-detail-scroll"
              style={{
                flex: 1,
                paddingRight: '0.5rem',
              }}
            >
              {/* Selected Attendees */}
              <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Selected Attendees
                </h3>
                <ul style={{
                  listStyleType: 'none',
                  padding: 0,
                  display: 'grid',
                  gap: '0.5rem'
                }}>
                  {users.filter(user => selectedAttendees.includes(String(user.id))).map(user => (
                    <li
                      key={user.id}
                      onClick={() => handleAttendeeChange(user.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        transition: 'all 0.2s ease',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                    >
                      <span style={{
                        color: '#f8fafc',
                        fontWeight: '500'
                      }}>
                        {user.firstName} {user.lastName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                margin: '1rem 0'
              }}></div>

              {/* Unselected Attendees */}
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Unselected Attendees
                </h3>
                <ul style={{
                  listStyleType: 'none',
                  padding: 0,
                  display: 'grid',
                  gap: '0.5rem'
                }}>
                  {users.filter(user => !selectedAttendees.includes(String(user.id))).map(user => (
                    <li
                      key={user.id}
                      onClick={() => handleAttendeeChange(user.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.2s ease',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                    >
                      <span style={{
                        color: 'rgba(248, 250, 252, 0.7)',
                        fontWeight: 'normal'
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
    </div>
  );
};

export default MinuteNoteDetail;