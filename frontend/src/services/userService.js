// userService.js
import axios from 'axios';

export const getAllUsers = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/users');
    return response;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`https://dummyjson.com/users/${id}`);
    return response;
  } catch (err) {
    console.error(`Error fetching user with ID ${id}:`, err);
    throw err;
  }
};
