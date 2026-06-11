import axiosInstance from './axiosInstance'

const noteService = {
  getNotes: (projectId) =>
    axiosInstance.get(`/notes/${projectId}`),

  getNoteById: (projectId, noteId) =>
    axiosInstance.get(`/notes/${projectId}/n/${noteId}`),

  createNote: (projectId, data) =>
    axiosInstance.post(`/notes/${projectId}`, data),

  updateNote: (projectId, noteId, data) =>
    axiosInstance.put(`/notes/${projectId}/n/${noteId}`, data),

  deleteNote: (projectId, noteId) =>
    axiosInstance.delete(`/notes/${projectId}/n/${noteId}`),
}
export default noteService;
