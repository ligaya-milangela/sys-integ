import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/notes`;

export const getNotes = () => axios.get(API_URL);
export const getNoteById = (id) => axios.get(`${API_URL}/${id}`);
export const createNote = async (noteData) => {
  try {
    const response = await axios.post(API_URL, noteData, {
      headers: {
        'Content-Type': 'application/json', // Ensures the server knows to expect JSON
      },
      withCredentials: true, // If you're using cookies/session management
    });
    return response.data;
  } catch (err) {
    console.error('Error creating note:', err);
    throw err; // Re-throw error for the calling function to handle
  }
};

export const updateNote = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`);
export const submitNoteForApproval = (id) => axios.patch(`${API_URL}/${id}/submit`);

export const getTicketStatus = async (referenceId) => {
  return axios.post('https://express-auro.onrender.com/api/ticket/status', {
    reference_id: referenceId,
  });
};
