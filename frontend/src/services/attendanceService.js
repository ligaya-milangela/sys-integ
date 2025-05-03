import axios from 'axios';

const API_URL = 'http://localhost:5003/api/attendance';

export const getAttendanceById = (id) =>
    axios.get(`http://localhost:5003/api/attendance/${id}`);
  
export const deleteAttendance = (id) => axios.delete(`${API_URL}/${id}`);