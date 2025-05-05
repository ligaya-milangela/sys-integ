import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/attendance`;

export const getAttendanceById = (id) =>
    axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/${id}`);
  
export const deleteAttendance = (id) => axios.delete(`${API_URL}/${id}`);