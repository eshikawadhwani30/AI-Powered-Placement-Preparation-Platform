import api from './axios';

const aptitudeApi = {
  getQuestions: async (params = {}) => {
    const response = await api.get('/aptitude/questions', { params });
    return response.data;
  },

  startTest: async (payload) => {
    const response = await api.post('/aptitude/start', payload);
    return response.data;
  },

  submitTest: async (payload) => {
    const response = await api.post('/aptitude/submit', payload);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/aptitude/history');
    return response.data;
  },
};

export default aptitudeApi;
