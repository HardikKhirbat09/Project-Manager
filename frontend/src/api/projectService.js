import axiosInstance from './axiosInstance'

const projectService = {
  getProjects: () =>
    axiosInstance.get('/projects'),

  getProjectById: (projectId) =>
    axiosInstance.get(`/projects/${projectId}`),

  createProject: (data) =>
    axiosInstance.post('/projects', data),

  updateProject: (projectId, data) =>
    axiosInstance.put(`/projects/${projectId}`, data),

  deleteProject: (projectId) =>
    axiosInstance.delete(`/projects/${projectId}`),

  getProjectMembers: (projectId) =>
    axiosInstance.get(`/projects/${projectId}/members`),

  addMember: (projectId, data) =>
    axiosInstance.post(`/projects/${projectId}/members`, data),

  updateMemberRole: (projectId, userId, data) =>
    axiosInstance.put(`/projects/${projectId}/members/${userId}`, data),

  removeMember: (projectId, userId) =>
    axiosInstance.delete(`/projects/${projectId}/members/${userId}`),
}
export default projectService;