import axios from 'axios'

const API_BASE = '/api/v1'

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  register: async (email, password, name) => {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email,
      password,
      name
    })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE}/auth/current-user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token')
}

export default authService
