import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import authService from './api/authService.js'
import Register from './pages/Register'
import ForgotPassword from './pages/forgotPassword.jsx'
import  {AuthProvider, useAuth } from './context/authContext.jsx'
import ResetPassword from './pages/resetPassword.jsx'
import VerifyEmail from './pages/verifyEmail.jsx'
function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
