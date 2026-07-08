import { useEffect, useState } from 'react'
import taskService from '../api/taskService'
import { useAuth } from '../context/AuthContext'

export default function SubtaskList({ projectId, taskId, userRole, onSubtasksUpdated, assignedTo }) {
  const [subtasks, setSubtasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '' })
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const canToggle = assignedTo === user._id || userRole === 'admin';
  useEffect(() => {
    fetchSubtasks()
  }, [projectId, taskId])
  const fetchSubtasks = async () => {
    try {
      const response = await taskService.getTaskById(projectId, taskId)
      setSubtasks(response.data.data.subtask || [])
    } catch (err) {
      console.error('Failed to load subtasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubtask = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await taskService.createSubtask(projectId, taskId, { title: formData.title })
      setFormData({ title: '' })
      setShowForm(false)
      await fetchSubtasks()
    } catch (err) {
      console.error('Failed to create subtask:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateSubtask = async (subtaskId, isCompleted) => {
    try {
      await taskService.updateSubtask(projectId, subtaskId, { isCompleted: !isCompleted })
      await fetchSubtasks()
    } catch (err) {
      console.error('Failed to update subtask:', err)
    }
  }

  const handleDeleteSubtask = async (subtaskId) => {
    if (!window.confirm('Delete this subtask?')) return

    try {
      await taskService.deleteSubtask(projectId, subtaskId)
      await fetchSubtasks()
    } catch (err) {
      console.error('Failed to delete subtask:', err)
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading subtasks...</p>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Subtasks</h2>

      {userRole === 'admin' && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 text-sm"
        >
          {showForm ? 'Cancel' : 'Add Subtask'}
        </button>
      )}

      {showForm && userRole === 'admin' && (
        <form onSubmit={handleCreateSubtask} className="mb-4 space-y-2">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Subtask title..."
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
          >
            {submitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      {subtasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No subtasks</p>
      ) : (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div key={subtask._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={subtask.isCompleted || false}
                onChange={() => handleUpdateSubtask(subtask._id, subtask.isCompleted)}
                disabled={!canToggle}
                className="h-4 w-4"
              />
              <span className={subtask.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}>
                {subtask.title}
              </span>
              {userRole === 'admin' && (
                <button
                  onClick={() => handleDeleteSubtask(subtask._id)}
                  className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
