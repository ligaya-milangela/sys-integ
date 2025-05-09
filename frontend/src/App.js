import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import PrivateRoute from './components/PrivateRoute';

function HomePage() {
  return (
    <div>
      <Login />
    </div>
  );
}

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', marginLeft: '200px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/meeting_screen"
            element={
              <PrivateRoute>
                <MeetingScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/minute_note_detail/:id"
            element={
              <PrivateRoute>
                <MinuteNoteDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/minute_view_detail/:id"
            element={
              <PrivateRoute>
                <MinuteNoteView />
              </PrivateRoute>
            }
          />
          <Route
            path="/minute_note_edit/:id"
            element={
              <PrivateRoute>
                <MinuteNoteEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/minute_create"
            element={
              <PrivateRoute>
                <MinuteCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <AttendanceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/details/:id"
            element={
              <PrivateRoute>
                <AttendanceDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/add"
            element={
              <PrivateRoute>
                <AttendanceForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/create"
            element={
              <PrivateRoute>
                <AttendanceForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/list"
            element={
              <PrivateRoute>
                <AttendanceList />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
