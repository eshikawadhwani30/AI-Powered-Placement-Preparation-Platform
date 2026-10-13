import api from './axios';

export const interviewApi = {
  // Start and generate new mock interview session
  startInterview: async (payload) => {
    const response = await api.post('/interview/generate', payload);
    return response.data;
  },

  // Submit student answer for Gemini rubric evaluation
  submitAnswer: async (payload) => {
    const response = await api.post('/interview/evaluate', payload);
    return response.data;
  },

  // Get interview practice history
  getHistory: async () => {
    const response = await api.get('/interview/history');
    return response.data;
  },

  // Get specific session details and answers
  getById: async (id) => {
    const response = await api.get(`/interview/${id}`);
    return response.data;
  },
};

export default interviewApi;
