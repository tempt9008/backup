import React from 'react'
import { Question } from '../../types'

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
  onToggleEnable: (id: string) => void
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
  onToggleEnable
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Existing Questions ({questions.length})</h2>
      {questions.map((q) => (
        <div key={q.id} className="bg-gray-100 p-4 rounded">
          <p><strong>Type:</strong> {q.type}</p>
          <p><strong>Question:</strong> {q.question}</p>
          <p><strong>Answer:</strong> {q.correctAnswer}</p>
          <p><strong>Time Limit:</strong> {q.timeLimit} seconds</p>
          <p><strong>Status:</strong> {q.enabled ? 'Enabled' : 'Disabled'}</p>
          {q.image && (
            <img 
              src={q.image} 
              alt="Question" 
              className="mt-2 max-w-full h-40 object-contain"
              loading="lazy"
            />
          )}
          <div className="mt-2 space-x-2">
            <button 
              onClick={() => onEdit(q)} 
              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(q.id)} 
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button 
              onClick={() => onToggleEnable(q.id)} 
              className={`${q.enabled ? 'bg-gray-500' : 'bg-green-500'} text-white px-2 py-1 rounded hover:opacity-80`}
            >
              {q.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuestionList