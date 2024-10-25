import React, { useState, useEffect } from 'react'
import { Question } from '../types'
import { v4 as uuidv4 } from 'uuid'
import QuestionForm from './AdminDashboard/QuestionForm'
import QuestionList from './AdminDashboard/QuestionList'
import BackupControls from './AdminDashboard/BackupControls'
import { saveQuestions, loadQuestions } from '../utils/storage'

interface AdminDashboardProps {
  onAddQuestion: (question: Question) => void
  onLogout: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAddQuestion, onLogout }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionType, setQuestionType] = useState<'text' | 'image'>('text')
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [image, setImage] = useState<string>('')
  const [timeLimit, setTimeLimit] = useState<number>(30)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadedQuestions = loadQuestions()
    setQuestions(loadedQuestions)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newQuestion: Question = {
        id: editingId || uuidv4(),
        type: questionType,
        question,
        correctAnswer,
        image: image || undefined,
        enabled: true,
        timeLimit
      }

      let updatedQuestions: Question[]
      if (editingId) {
        updatedQuestions = questions.map(q => q.id === editingId ? newQuestion : q)
      } else {
        if (questions.length >= 100) {
          throw new Error('Maximum number of questions (100) reached')
        }
        updatedQuestions = [...questions, newQuestion]
      }

      const saved = saveQuestions(updatedQuestions)
      if (!saved) {
        throw new Error('Failed to save questions. Storage limit might be exceeded.')
      }

      setQuestions(updatedQuestions)
      if (!editingId) {
        onAddQuestion(newQuestion)
      }
      resetForm()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const resetForm = () => {
    setQuestionType('text')
    setQuestion('')
    setCorrectAnswer('')
    setImage('')
    setTimeLimit(30)
    setEditingId(null)
  }

  const handleEdit = (q: Question) => {
    setEditingId(q.id)
    setQuestionType(q.type)
    setQuestion(q.question)
    setCorrectAnswer(q.correctAnswer)
    setImage(q.image || '')
    setTimeLimit(q.timeLimit || 30)
  }

  const handleDelete = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id)
    const saved = saveQuestions(updatedQuestions)
    if (saved) {
      setQuestions(updatedQuestions)
      setError(null)
    } else {
      setError('Failed to delete question')
    }
  }

  const handleToggleEnable = (id: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, enabled: !q.enabled } : q
    )
    const saved = saveQuestions(updatedQuestions)
    if (saved) {
      setQuestions(updatedQuestions)
      setError(null)
    } else {
      setError('Failed to update question status')
    }
  }

  const handleRestore = (restoredQuestions: Question[]) => {
    setQuestions(restoredQuestions)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <BackupControls
          onRestore={handleRestore}
          onError={setError}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <QuestionForm
          questionType={questionType}
          question={question}
          correctAnswer={correctAnswer}
          image={image}
          timeLimit={timeLimit}
          setQuestionType={setQuestionType}
          setQuestion={setQuestion}
          setCorrectAnswer={setCorrectAnswer}
          setImage={setImage}
          setTimeLimit={setTimeLimit}
          handleSubmit={handleSubmit}
          isEditing={!!editingId}
        />

        <div className="mt-8">
          <QuestionList
            questions={questions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleEnable={handleToggleEnable}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard