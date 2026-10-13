import api from './axios';

const roadmapApi = {
  getRoadmap: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  },

  generate: async () => {
    const response = await api.post('/roadmap/generate', {}, { timeout: 90000 });
    return response.data;
  },

  updateTask: async (taskId, isCompleted) => {
    const response = await api.put(`/roadmap/tasks/${taskId}`, { isCompleted });
    return response.data;
  },
};

export default roadmapApi;
