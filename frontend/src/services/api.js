/**
 * API Service for SanaPath AI
 * Handles all backend communication
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authAPI = {
  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (data) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  firebaseAuth: (firebaseToken) => apiCall('/auth/firebase', {
    method: 'POST',
    body: JSON.stringify({ token: firebaseToken }),
  }),
  
  getMe: () => apiCall('/auth/me'),
};

// Survey API
export const surveyAPI = {
  submitSurvey: (data) => apiCall('/survey/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getRecommendations: () => apiCall('/survey/recommendations'),
};

// Projects API
export const projectsAPI = {
  startProject: (projectData) => apiCall('/projects/start', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }),
  
  getMyProjects: (status) => {
    const params = status ? `?status_filter=${status}` : '';
    return apiCall(`/projects/my-projects${params}`);
  },
  
  getProject: (uuid) => apiCall(`/projects/${uuid}`),
  
  updateProject: (uuid, data) => apiCall(`/projects/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  deleteProject: (uuid) => apiCall(`/projects/${uuid}`, {
    method: 'DELETE',
  }),
  
  completeTask: (uuid, taskId) => apiCall(`/projects/${uuid}/complete-task`, {
    method: 'POST',
    body: JSON.stringify({ task_id: taskId }),
  }),
};

// Community API
export const communityAPI = {
  getProjects: (page = 1, tags = []) => {
    const params = new URLSearchParams({ page: page.toString() });
    tags.forEach(tag => params.append('tags', tag));
    return apiCall(`/community/projects?${params}`);
  },
  
  getProject: (uuid) => apiCall(`/community/projects/${uuid}`),
  
  joinProject: (uuid) => apiCall(`/community/projects/${uuid}/join`, {
    method: 'POST',
  }),
};

// AI API
export const aiAPI = {
  generateProjectIdea: (interests) => apiCall('/ai/generate-idea', {
    method: 'POST',
    body: JSON.stringify({ interests }),
  }),
  
  getProjectHelp: (projectId, question) => apiCall('/ai/help', {
    method: 'POST',
    body: JSON.stringify({ project_id: projectId, question }),
  }),
};

export default {
  auth: authAPI,
  survey: surveyAPI,
  projects: projectsAPI,
  community: communityAPI,
  ai: aiAPI,
};
