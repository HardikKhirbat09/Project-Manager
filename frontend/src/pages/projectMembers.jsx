import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import projectService from '../api/projectService'
import { useAuth } from '../context/authContext'

export default function ProjectMembersPage() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [projectId])

  const fetchMembers = async () => {
    try {
      const response = await projectService.getProjectMembers(projectId)
      const memberList = response.data.data
      setMembers(memberList)

      const userMember = memberList.find((m) => m.user._id === user._id)
      setUserRole(userMember?.role)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setInviting(true)
    try {
      await projectService.addMember(projectId, {
        email: inviteEmail,
        role: inviteRole,
      })
      setInviteEmail('')
      setInviteRole('member')
      setShowInviteForm(false)
      await fetchMembers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member')
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return

    try {
      await projectService.removeMember(projectId, userId)
      await fetchMembers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member')
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await projectService.updateMemberRole(projectId, userId, { role: newRole })
      await fetchMembers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Project Members</h1>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to Project
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {userRole === 'admin' && (
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="mb-4 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
        >
          {showInviteForm ? 'Cancel' : 'Add Member'}
        </button>
      )}

      {showInviteForm && userRole === 'admin' && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <form onSubmit={handleAddMember} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="member@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="admin">Project Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {inviting ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member._id}>
                <td className="px-6 py-3 text-sm text-gray-900">{member.user.email}</td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {userRole === 'admin' && member.user._id !== user._id ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.user._id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="capitalize">{member.role}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-sm">
                  {userRole === 'admin' && member.user._id !== user._id && (
                    <button
                      onClick={() => handleRemoveMember(member.user._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
