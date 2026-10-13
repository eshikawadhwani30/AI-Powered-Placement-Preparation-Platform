import api from './axios';

export const resumeApi = {
  // Upload PDF resume with optional target job description
  analyzeResume: async (formData) => {
    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get previous resume analysis history for current student
  getHistory: async () => {
    const response = await api.get('/resume/history');
    return response.data;
  },

  // Get single analysis details by ID
  getById: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  // Delete analysis by ID
  deleteResume: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  },
};

export default resumeApi;
