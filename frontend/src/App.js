// src/App.js

import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GoogleMeetButton from './components/GoogleMeetButton';  // Google Meet button
import { getAttendance } from './services/api';
import MeetingScreen from './pages/meetings/meeting_screen';
import MinuteNoteEdit from './pages/meetings/minute_note_edit';
import MinuteCreate from './pages/meetings/minute_create';

function Sidebar({ setActivePage }) {
  return (
    <div style={{
      width: '200px',
      padding: '10px',
      borderRight: '1px solid #ccc',
      height: '100vh'
    }}>
      <button onClick={() => setActivePage('googleMeet')}>Google Meet</button> {/* Google Meet */}
      <button onClick={() => setActivePage('meeting')}>Meeting</button>
      <button onClick={() => setActivePage('attendance')}>Attendance</button>
    </div>
  );
}

function AppContent({ activePage }) {
  const [attendanceList, setAttendanceList] = React.useState([]);

  React.useEffect(() => {
    if (activePage === 'attendance') {
      getAttendance()
        .then((res) => {
          setAttendanceList(res.data);
          console.log('API connection successful!', res.data);
        })
        .catch((err) => {
          console.error('Error fetching attendance:', err);
        });
    }
  }, [activePage]);

  switch (activePage) {
    case 'googleMeet':
      return (
        <div>
          <h2>Google Meet</h2>
          <GoogleMeetButton />
        </div>
      );
    case 'meeting':
      return <MeetingScreen />; // Use MeetingScreen for meetings
    default:
      return <div>Select a page</div>; // Default page
  }
}

function App() {
  const [activePage, setActivePage] = React.useState('googleMeet');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar setActivePage={setActivePage} />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<AppContent activePage={activePage} />} />
          <Route path="/meeting_screen" element={<MeetingScreen />} />
          <Route path="/minute_note_edit/:id" element={<MinuteNoteEdit />} />
          <Route path="/minute_create" element={<MinuteCreate />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
