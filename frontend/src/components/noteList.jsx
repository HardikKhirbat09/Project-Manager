import { useState } from 'react'
import noteService from '../api/notesService'

export default function NoteList({ notes, projectId, userRole, onNoteDeleted }) {
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  const handleEdit = (note) => {
    setEditingId(note._id)
    setEditContent(note.content)
  }

  const handleSave = async (noteId) => {
    try {
      await noteService.updateNote(projectId, noteId, { content: editContent })
      setEditingId(null)
      onNoteDeleted()
    } catch (err) {
      console.error('Failed to update note:', err)
    }
  }

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note?')) return

    try {
      await noteService.deleteNote(projectId, noteId)
      onNoteDeleted()
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  if (notes.length === 0) {
    return <p className="text-gray-500 text-center py-8">No notes yet</p>
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note._id} className="bg-white rounded-lg shadow p-4">
          {editingId === note._id ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(note._id)}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-1 bg-gray-300 text-gray-900 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-2">{note.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By: {note.createdBy?.username}</span>
                {userRole === 'admin' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
