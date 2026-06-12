import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import authService from './api/authService.js'
import Register from './pages/Register'
import ForgotPassword from './pages/forgotPassword.jsx'
import { AuthProvider, useAuth } from './context/authContext.jsx'
import ResetPassword from './pages/resetPassword.jsx'
import VerifyEmail from './pages/verifyEmail.jsx'
import DashboardLayout from './pages/dashboard.jsx'
import ProjectListPage from './pages/projectsList.jsx'
import ProjectCreatePage from './pages/projectCreate.jsx'
import ProjectDetailPage from './pages/projectDetail.jsx'
import ProjectEditPage from './pages/projectEdit.jsx'
import UserProfilePage from './pages/userProfile.jsx'
import ProjectMembersPage from './pages/projectMembers.jsx'
import TaskDetailPage from './pages/taskPage.jsx'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/reset-password/:token" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
          <Route path="/verify-email" element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectListPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects/create" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects/:projectId" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects/:projectId/edit" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects/:projectId/members" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectMembersPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/projects/:projectId/tasks/:taskId" element={
            <ProtectedRoute>
              <DashboardLayout>
                <TaskDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/projects" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
