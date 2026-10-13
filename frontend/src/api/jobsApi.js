import api from './axios';

export const jobsApi = {
  // Fetch paginated jobs with search and location filters
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get single job details
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Get personalized job recommendations matching user skills
  getRecommendations: async (profileOverrides = {}) => {
    const response = await api.post('/jobs/recommendations', profileOverrides);
    return response.data;
  },

  // Create job (Admin)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },
};

export default jobsApi;
