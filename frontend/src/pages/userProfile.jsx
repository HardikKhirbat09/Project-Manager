import { useAuth } from '../context/authContext'
import { useState } from 'react'    
import authService from '../api/authService'

export default function UserProfilePage() {
    const { user } = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    if (!user) return null
    const handleVerify = async () => {
        setError('')
        setSuccess('')
        try {
            await authService.resendEmailVerification()
            setSuccess('Verification email sent! Please check your inbox.')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification email.')
        }
    }
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <p className="px-4 py-2 bg-gray-50 rounded border border-gray-300">{user.username}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="px-4 py-2 bg-gray-50 rounded border border-gray-300">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                        <p className="px-4 py-2 bg-gray-50 rounded border border-gray-300 flex justify-between items-center">
                            {user.isEmailVerified ? (
                                <span className="text-green-600 font-medium">✓ Verified</span>
                            ) : (
                                <>
                                    <span className="text-red-600 font-medium">✗ Not Verified</span>
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={handleVerify}
                                    >
                                        Verify Now
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                        <p className="px-4 py-2 bg-gray-50 rounded border border-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
