import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import authService from './api/authService.js'
import Register from './pages/Register'
import ForgotPassword from './pages/forgotPassword.jsx'
import  {AuthProvider, useAuth } from './context/authContext.jsx'
import ResetPassword from './pages/resetPassword.jsx'
import VerifyEmail from './pages/verifyEmail.jsx'
import DashboardLayout from './pages/dashboard.jsx'
import ProjectListPage from './pages/projectsList.jsx'
import ProjectCreatePage from './pages/projectCreate.jsx'
import ProjectDetailPage from './pages/projectDetail.jsx'
import ProjectEditPage from './pages/projectEdit.jsx'
import UserProfilePage from './pages/userProfile.jsx'
import ProjectMembersPage from './pages/projectMembers.jsx'
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
        <Route path="/projects" element={
          <DashboardLayout>
            <ProjectListPage />
          </DashboardLayout>
        } />
        <Route path="/projects/create" element={
          <DashboardLayout>
            <ProjectCreatePage />
          </DashboardLayout>
        } />
        <Route path="/projects/:projectId" element={
          <DashboardLayout>
            <ProjectDetailPage />
          </DashboardLayout>
        } />
        <Route path="/projects/:projectId/edit" element={
          <DashboardLayout>
            <ProjectEditPage />
          </DashboardLayout>
        } />
        <Route path="/profile" element={
          <DashboardLayout>
            <UserProfilePage />
          </DashboardLayout>
        } />
        <Route path="/projects/:projectId/members" element={
          <DashboardLayout>
            <ProjectMembersPage />
          </DashboardLayout>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
