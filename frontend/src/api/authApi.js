import api from './axios';

export const authApi = {
  // Register a new student account
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Log in with email and password
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Terminate session and clear cookie
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Verify and fetch current user by token
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Fetch full student profile details
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile details (skills, roles, location, bio)
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

export default authApi;
