import axiosInstance from './axiosInstance'

const authService = {
  register: (data) =>
    axiosInstance.post('/auth/register', data),

  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),

  logout: () =>
    axiosInstance.post('/auth/logout'),

  getCurrentUser: () =>
    axiosInstance.get('/auth/current-user'),

  verifyEmail: (token) =>
    axiosInstance.get(`/auth/verify-email/${token}`),

  resendEmailVerification: () =>
    axiosInstance.post('/auth/resend-email-verification'),

  changePassword: (currentPassword, newPassword) =>
    axiosInstance.post('/auth/change-password', {
      currentPassword,
      newPassword,
    }),

  forgotPassword: (email) =>
    axiosInstance.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    axiosInstance.post(`/auth/reset-password/${token}`, {
      newPassword,
    }),
}
export default authService;