import axios from 'axios';
const API = 'http://localhost:5003/api';

export const fetchAttendance = () => axios.get(`${API}/attendance_route`);
export const postAttendance = (data) => axios.post(`${API}/attendance_route`, data);
export const fetchNotes = () => axios.get(`${API}/notes`);
export const postNote = (data) => axios.post(`${API}/notes`, data);
export const getAttendance = () => axios.get(`${API}/attendance_route`);