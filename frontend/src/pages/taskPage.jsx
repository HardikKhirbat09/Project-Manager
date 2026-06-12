import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import taskService from '../api/taskService'
import projectService from '../api/projectService'
import { useAuth } from '../context/authContext'
import SubtaskList from '../components/subtaskList'

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    assignedTo: '',
  })

  useEffect(() => {
    fetchTaskAndMembers()
  }, [projectId, taskId])

  const fetchTaskAndMembers = async () => {
    try {
      const [taskRes, membersRes] = await Promise.all([
        taskService.getTaskById(projectId, taskId),
        projectService.getProjectMembers(projectId),
      ])

      const taskData = taskRes.data.data
      setTask(taskData)
      setFormData({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        assignedTo: taskData.assignedTo?._id || '',
      })

      const userMember = membersRes.data.data.find((m) => m.user._id === user._id)
      setUserRole(userMember?.role)
      setMembers(membersRes.data.data)

      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await taskService.updateTask(projectId, taskId, formData)
      setEditing(false)
      await fetchTaskAndMembers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return

    try {
      await taskService.deleteTask(projectId, taskId)
      navigate(`/projects/${projectId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Task not found</p>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/projects/${projectId}`)}
        className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Project
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {!editing ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>
              {userRole === 'admin' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium capitalize">{task.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="font-medium">{task.assignedTo?.email || 'Unassigned'}</p>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <SubtaskList projectId={projectId} taskId={taskId} userRole={userRole} onSubtasksUpdated={fetchTaskAndMembers} subtasks={task.subtask} assignedTo={task.assignedTo} />
    </div>
  )
}
