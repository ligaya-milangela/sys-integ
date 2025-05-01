import axios from 'axios';

const API_URL = 'http://localhost:5003/api/notes';

export const getNotes = () => axios.get(API_URL);
export const getNoteById = (id) => axios.get(`${API_URL}/${id}`);
export const createNote = (noteData) => axios.post(API_URL, noteData);
export const updateNote = (id, updatedData) => axios.put(`${API_URL}/${id}`, updatedData);
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`);
export const submitNoteForApproval = (id) => axios.patch(`${API_URL}/${id}/submit`);