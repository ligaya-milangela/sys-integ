import axios from 'axios';
const API = `${process.env.REACT_APP_API_URL}/api`;

export const fetchAttendance = () => axios.get(`${API}/attendance/list`);
export const postAttendance = (data) => axios.post(`${API}/attendance/create`, data);

export const fetchNotes = () => axios.get(`${API}/notes`);
export const postNote = (data) => axios.post(`${API}/notes`, data);

export const getAttendance = () => axios.get(`${API}/attendance/list`);
