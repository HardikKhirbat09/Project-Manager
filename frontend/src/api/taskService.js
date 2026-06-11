import axiosInstance from './axiosInstance'

const taskService = {
  getTasks: (projectId) =>
    axiosInstance.get(`/tasks/${projectId}`),

  getTaskById: (projectId, taskId) =>
    axiosInstance.get(`/tasks/${projectId}/t/${taskId}`),

  createTask: (projectId, data) =>
    axiosInstance.post(`/tasks/${projectId}`, data),

  updateTask: (projectId, taskId, data) =>
    axiosInstance.put(`/tasks/${projectId}/t/${taskId}`, data),

  deleteTask: (projectId, taskId) =>
    axiosInstance.delete(`/tasks/${projectId}/t/${taskId}`),

  createSubtask: (projectId, taskId, data) =>
    axiosInstance.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data),

  updateSubtask: (projectId, subtaskId, data) =>
    axiosInstance.put(`/tasks/${projectId}/st/${subtaskId}`, data),

  deleteSubtask: (projectId, subtaskId) =>
    axiosInstance.delete(`/tasks/${projectId}/st/${subtaskId}`),
}

export default taskService;