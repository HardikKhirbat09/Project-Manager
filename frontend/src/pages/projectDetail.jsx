import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import projectService from '../api/projectService'
import taskService from '../api/taskService'
import noteService from '../api/notesService'
import { useAuth } from '../context/authContext'
import TaskForm from '../components/taskForm'
import TaskList from '../components/taskList'
import NoteForm from '../components/noteForm'
import NoteList from '../components/noteList'

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { user} = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('tasks')
  const [userRole, setUserRole] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchProjectData()
  }, [projectId])

  const fetchProjectData = async () => {
    try {
      const [projectRes, membersRes] = await Promise.all([
        projectService.getProjectById(projectId),
        projectService.getProjectMembers(projectId),
      ])

      setProject(projectRes.data.data)
      setMembers(membersRes.data.data)

      const userMember = membersRes.data.data.find((m) => m.user._id === user._id)
      setUserRole(userMember?.role)

      await Promise.all([fetchTasks(), fetchNotes()])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks(projectId)
      setTasks(response.data.data)
    } catch (err) {
      console.error('Failed to load tasks:', err)
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await noteService.getNotes(projectId)
      setNotes(response.data.data)
    } catch (err) {
      console.error('Failed to load notes:', err)
    }
  }

  const handleTaskCreated = () => {
    setShowTaskForm(false)
    fetchTasks()
  }

  const handleTaskDeleted = () => {
    fetchTasks()
  }

  const handleNoteCreated = () => {
    setShowNoteForm(false)
    fetchNotes()
  }

  const handleNoteDeleted = () => {
    fetchNotes()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Project not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
          <p className="text-sm text-gray-500 mt-2">Role: {userRole}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/projects/${projectId}/members`}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Members
          </Link>
          {userRole === 'admin' && (
            <Link
              to={`/projects/${projectId}/edit`}
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'notes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {activeTab === 'tasks' && (
        <div>
          {userRole === 'admin' && (
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="mb-4 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              {showTaskForm ? 'Cancel' : 'Create Task'}
            </button>
          )}

          {showTaskForm && userRole === 'admin' && (
            <TaskForm projectId={projectId} members={members} onSuccess={handleTaskCreated} />
          )}

          <TaskList
            tasks={tasks}
            projectId={projectId}
            userRole={userRole}
            onTaskDeleted={handleTaskDeleted}
            onTasksUpdated={fetchTasks}
            members={members}
          />
        </div>
      )}

      {activeTab === 'notes' && (
        <div>
          {userRole === 'admin' && (
            <button
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="mb-4 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              {showNoteForm ? 'Cancel' : 'Create Note'}
            </button>
          )}

          {showNoteForm && userRole === 'admin' && (
            <NoteForm projectId={projectId} onSuccess={handleNoteCreated} />
          )}

          <NoteList notes={notes} projectId={projectId} userRole={userRole} onNoteDeleted={handleNoteDeleted} />
        </div>
      )}
    </div>
  )
}
