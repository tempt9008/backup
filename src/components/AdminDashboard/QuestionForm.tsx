import React from 'react'
import { Question } from '../../types'

interface QuestionFormProps {
  questionType: 'text' | 'image'
  question: string
  correctAnswer: string
  image: string
  timeLimit: number
  setQuestionType: (type: 'text' | 'image') => void
  setQuestion: (question: string) => void
  setCorrectAnswer: (answer: string) => void
  setImage: (image: string) => void
  setTimeLimit: (time: number) => void
  handleSubmit: (e: React.FormEvent) => void
  isEditing: boolean
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionType,
  question,
  correctAnswer,
  image,
  timeLimit,
  setQuestionType,
  setQuestion,
  setCorrectAnswer,
  setImage,
  setTimeLimit,
  handleSubmit,
  isEditing
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 100KB)
      if (file.size > 100 * 1024) {
        alert('Image size must be less than 100KB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Question Type</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as 'text' | 'image')}
          className="w-full p-2 border rounded"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
          required
          maxLength={200}
        />
      </div>
      {questionType === 'image' && (
        <div>
          <label className="block mb-1">Upload Image (max 100KB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          {image && <img src={image} alt="Uploaded" className="mt-2 max-w-full h-40 object-contain" />}
        </div>
      )}
      <div>
        <label className="block mb-1">Correct Answer</label>
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="w-full p-2 border rounded"
          required
          maxLength={100}
        />
      </div>
      <div>
        <label className="block mb-1">Time Limit (seconds)</label>
        <input
          type="number"
          min="5"
          max="300"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {isEditing ? 'Update Question' : 'Add Question'}
      </button>
    </form>
  )
}

export default QuestionForm