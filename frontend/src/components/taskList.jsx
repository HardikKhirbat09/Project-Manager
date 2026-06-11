import { Link } from 'react-router-dom'
import taskService from '../api/taskService'

export default function TaskList({ tasks, projectId, userRole, onTaskDeleted, onTasksUpdated, members }) {
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(projectId, taskId, { status: newStatus })
      onTasksUpdated()
    } catch (err) {
      console.error('Failed to update task status:', err)
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return

    try {
      await taskService.deleteTask(projectId, taskId)
      onTaskDeleted()
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleAssignChange = async (taskId, userId) => {
    try {
      await taskService.updateTask(projectId, taskId, { assignedTo: userId })
      onTasksUpdated()
    } catch (err) {
      console.error('Failed to update task assignment:', err)
    }
  }

  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center py-8">No tasks yet</p>
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <Link
                to={`/projects/${projectId}/tasks/${task._id}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-700"
              >
                {task.title}
              </Link>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <select
                  value={task.assignedTo?._id || ''}
                  onChange={(e) => handleAssignChange(task._id, e.target.value)}
                  className="text-xs px-2 py-1 rounded border"
                >
                  <option value="">Unassigned</option>

                  {members.map((m) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.email}
                    </option>
                  ))}
                </select>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            {userRole === 'admin' && (
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
