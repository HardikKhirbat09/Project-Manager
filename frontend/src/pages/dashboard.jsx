import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

export default function DashboardLayout({ children }) {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/projects" className="text-xl font-bold text-blue-600">
                            Project Manager
                        </Link>
                        <div className="hidden md:flex gap-6">
                            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
                                Projects
                            </Link>
                            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                                Profile
                            </Link>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            { user && !user.isEmailVerified && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">Email Not Verified</p>
                </div>
            )}
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
