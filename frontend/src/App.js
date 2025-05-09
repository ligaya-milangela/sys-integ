import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GoogleMeetButton from './components/GoogleMeetButton';
import MeetingScreen from './pages/meetings/meeting_screen';
import MinuteNoteEdit from './pages/meetings/minute_note_edit';
import MinuteCreate from './pages/meetings/minute_create';
import MinuteNoteDetail from './pages/meetings/minute_note_detail';
import MinuteNoteView from './pages/meetings/minute_note_view';
import AttendanceForm from './pages/attendance/attendance_form';
import AttendanceList from './pages/attendance/attendance_list';
import AttendanceDetails from './pages/attendance/attendance_details';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup'; 
function HomePage() {
  return (
    <div>
      <Login/>
    </div>
  );
}

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', marginLeft: '200px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meeting_screen" element={<MeetingScreen />} />
          <Route path="/minute_note_detail/:id" element={<MinuteNoteDetail />} />
          <Route path="/minute_view_detail/:id" element={<MinuteNoteView />} />
          <Route path="/minute_note_edit/:id" element={<MinuteNoteEdit />} />
          <Route path="/minute_create" element={<MinuteCreate />} />
          <Route path="/attendance" element={<AttendanceList />} />
          <Route path="/attendance/details/:id" element={<AttendanceDetails />} />
          <Route path="/attendance/add" element={<AttendanceForm />} />
          <Route path="/attendance/create" element={<AttendanceForm />} />
          <Route path="/attendance/list" element={<AttendanceList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
