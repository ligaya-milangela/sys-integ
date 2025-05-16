import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getNotes, getTicketStatus, createNote } from '../../services/notesService';
import axios from 'axios';

const MeetingScreen = () => {
  const [meetingNotes, setMeetingNotes] = useState([]);
  const [filter, setFilter] = useState(['Approved', 'For Approval', 'Declined']);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', content: '' });
  const [createFocused, setCreateFocused] = useState({ title: false, content: false });
  const [createLoading, setCreateLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMeetingNotes = async () => {
    try {
      const response = await getNotes();
      const allNotes = response.data;

      const notesWithStatus = await Promise.all(
        allNotes.map(async (note) => {
          try {
            const res = await getTicketStatus(note._id);
            const ticketStatus = res.data.ticket[0]?.status || 'Unavailable';
            return { ...note, ticketStatus };
          } catch (err) {
            return { ...note, ticketStatus: 'Unavailable' };
          }
        })
      );

      setMeetingNotes(notesWithStatus);
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

  const toggleFilter = (status) => {
    setFilter((prevFilter) =>
      prevFilter.includes(status)
        ? prevFilter.filter((item) => item !== status)
        : [...prevFilter, status]
    );
  };

  const handleRefreshClick = () => {
    setRefreshing(true);
    fetchMeetingNotes();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    const noteData = {
      title: createForm.title.trim(),
      content: createForm.content.trim(),
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
      setCreateForm({ title: '', content: '' });
      setShowCreateModal(false);
      setCreateLoading(false);
      fetchMeetingNotes();
    } catch (err) {
      setCreateLoading(false);
      alert(err.response?.data?.message || 'Failed to create note or send to ticket API.');
    }
  };

  const filteredNotes = meetingNotes.filter(
    (note) =>
      filter.includes(note.ticketStatus) &&
      note.title.toLowerCase().startsWith(searchQuery.toLowerCase())
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
      backgroundRepeat: 'no-repeat',
      overflowY: 'auto',
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      {/* Modal for Create Minute */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#334155',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
              width: '100%',
              maxWidth: 400,
              fontFamily: "'Poppins', sans-serif",
              position: 'relative',
              color: '#fff'
            }}
          >
            {/* Modal header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.25rem 1rem 1.25rem',
              borderBottom: '1px solid #475569',
              borderTopLeftRadius: '0.75rem',
              borderTopRightRadius: '0.75rem',
              background: '#334155'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#fff'
              }}>
                Create Meeting Note
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {/* Modal body */}
            <form
              onSubmit={handleCreateSubmit}
              style={{
                padding: '1.25rem',
                background: '#334155',
                borderBottomLeftRadius: '0.75rem',
                borderBottomRightRadius: '0.75rem'
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="minute-title"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#fff'
                  }}
                >
                  Title
                </label>
                <input
                  id="minute-title"
                  type="text"
                  value={createForm.title}
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #64748b',
                    fontSize: '1rem',
                    color: '#fff',
                    background: '#475569',
                    outline: 'none',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                  onFocus={e => setCreateFocused({ ...createFocused, title: true })}
                  onBlur={e => setCreateFocused({ ...createFocused, title: e.target.value.length > 0 })}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="minute-content"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#fff'
                  }}
                >
                  Content
                </label>
                <textarea
                  id="minute-content"
                  value={createForm.content}
                  onChange={e => setCreateForm({ ...createForm, content: e.target.value })}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #64748b',
                    fontSize: '1rem',
                    color: '#fff',
                    background: '#475569',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                  onFocus={e => setCreateFocused({ ...createFocused, content: true })}
                  onBlur={e => setCreateFocused({ ...createFocused, content: e.target.value.length > 0 })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="submit"
                  disabled={createLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#2563eb',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: '0.5rem',
                    padding: '0.6rem 1.5rem',
                    border: 'none',
                    cursor: createLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'background 0.2s',
                    opacity: createLoading ? 0.7 : 1
                  }}
                >
                  <svg style={{ marginRight: 8 }} width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  {createLoading ? 'Saving...' : 'Save Meeting Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <br></br>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
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
          <h1 className="wave-text" style={{
            margin: 0,
            fontWeight: '600',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            gap: '0.2rem',
            color: 'white',
          }}>
            {'Meeting Minutes'.split('').map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                {char === ' ' ? '\u00A0' : char} {}
              </span>
            ))} 
          </h1>

          <button
            onClick={() => navigate('/login')}
            className="logout-btn"
          >
            <div className="sign">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 9v-2h10v10h-10v-2h-2v4h14v-14h-14v4h2zm-6 3l4-4v3h8v2h-8v3l-4-4z" />
              </svg>
            </div>
            <span className="text">Logout</span>
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '0 0 300px', 
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(51, 65, 85, 0.7)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
            />

            <button
              onClick={() => setShowCreateModal(true)}
              className="button"
            >
              <span>Create</span>
            </button>

            <button
              onClick={handleRefreshClick}
              className="refresh-btn"
            >
              <svg
                className={refreshing ? "spin" : ""}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0115.03-4.36L23 10M1 14l4.47 5.36A9 9 0 0020.49 15"></path>
              </svg>
              Refresh
            </button>
          </div>

          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="status-btn"
          >
            Status
          </button>
        </div>

        <div
          style={{
            maxHeight: isAccordionOpen ? '200px' : '0',
            opacity: isAccordionOpen ? 1 : 0,
            transform: isAccordionOpen ? 'translateY(0)' : 'translateY(-10px)',
            overflow: 'hidden',
            padding: isAccordionOpen ? '1rem 0' : '0',
            transition: 'max-height 0.5s ease, opacity 0.5s ease, transform 0.5s ease, padding 0.5s ease',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => toggleFilter('Approved')}
              style={{
                backgroundColor: filter.includes('Approved') ? '#4973ff' : '#334155b3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Approved
            </button>
            <button
              onClick={() => toggleFilter('For Approval')}
              style={{
                backgroundColor: filter.includes('For Approval') ? '#4973ff' : '#334155b3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              For Approval
            </button>
            <button
              onClick={() => toggleFilter('Declined')}
              style={{
                backgroundColor: filter.includes('Declined') ? '#4973ff' : '#334155b3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Declined
            </button>
          </div>
        </div>

        <br></br>
        {filteredNotes.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(248, 250, 252, 0.7)',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              No meeting minutes found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            {filteredNotes.map(note => (
              <div
                key={note._id}
                onClick={() => handleNoteClick(note._id)}
                className="note-card"
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
                  display: 'inline-block',
                  backgroundColor: note.ticketStatus === 'For Approval' ? 'rgba(255, 223, 0, 0.2)' :
                    note.ticketStatus === 'Declined' ? 'rgba(255, 0, 0, 0.2)' :
                      'rgba(59, 130, 246, 0.2)',
                  color: note.ticketStatus === 'For Approval' ? '#FFD700' :
                    note.ticketStatus === 'Declined' ? '#FF0000' :
                      '#93c5fd',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  {note.ticketStatus}
                </div>
                <div style={{
                  color: 'rgba(248, 250, 252, 0.6)',
                  fontSize: '0.85rem'
                }}>
                  {formatDate(note.createdAt)}
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
