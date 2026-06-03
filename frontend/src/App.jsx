import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import authService from './services/authService.js'
import './App.css'

function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div style={{ padding: '20px' }}>
              <h1>Welcome to Project Manager</h1>
              <p>Dashboard coming soon...</p>
              <button onClick={() => {
                authService.logout()
                window.location.href = '/login'
              }}>
                Logout
              </button>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
