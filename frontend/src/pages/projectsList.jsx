import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import  projectService  from '../api/projectService.js'
import { useAuth } from '../context/authContext.jsx'


export default function ProjectListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { logout } = useAuth()
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects()
      console.log('Projects response:', response.data.data)
      setProjects(response.data.data || [])
      setError('')
    } catch (err) {
        if(err.response?.status === 401) {
          await logout();
          return;
        }
      console.error('Error fetching projects:', err)
      setError(err.response?.data?.message || 'Failed to load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await projectService.deleteProject(projectId)
      setProjects(projects.filter((p) => p.project._id !== projectId))
    } catch (err) {
        if(err.response?.status === 401) {
          await logout();
          return;
        }
      setError(err.response?.data?.message || 'Failed to delete project')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Link
          to="/projects/create"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Create Project
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No projects yet</p>
          <Link
            to="/projects/create"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item) => {
            const projectData = item.project || item
            const projectId = projectData._id
            const projectName = projectData.name
            const projectDesc = projectData.description
            const projectCreated = projectData.createdAt
            const userRole = item.role || 'member'

            return (
              <div key={projectId} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{projectName}</h2>
                    <p className="text-sm text-gray-500 capitalize">Role: {userRole}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{projectDesc || 'No description'}</p>

                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    Created: {projectCreated ? new Date(projectCreated).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/projects/${projectId}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium text-center rounded hover:bg-blue-700"
                  >
                    View
                  </Link>
                  {userRole === 'admin' && (
                    <>
                      <Link
                        to={`/projects/${projectId}/edit`}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium text-center rounded hover:bg-gray-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(projectId)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
