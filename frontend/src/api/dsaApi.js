import api from './axios';

const dsaApi = {
  getQuestions: async (params = {}) => {
    const response = await api.get('/dsa/questions', { params });
    return response.data;
  },

  getQuestionById: async (id) => {
    const response = await api.get(`/dsa/questions/${id}`);
    return response.data;
  },

  updateProgress: async (payload) => {
    const response = await api.post('/dsa/progress', payload);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/dsa/progress');
    return response.data;
  },
};

export default dsaApi;
