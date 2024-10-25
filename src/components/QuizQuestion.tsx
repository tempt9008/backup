import React, { useState, useEffect, useRef } from 'react'
import { Question } from '../types'
import Confetti from 'react-confetti'
import { Timer, Pause, Play } from 'lucide-react'

interface QuizQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  currentQuestion: number
  totalQuestions: number
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions
}) => {
  const [answer, setAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [timeLeft, setTimeLeft] = useState(question.timeLimit)
  const [isPaused, setIsPaused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [question])

  // Re-focus input when pause state changes
  useEffect(() => {
    if (!isPaused && !showFeedback && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isPaused, showFeedback])

  useEffect(() => {
    setTimeLeft(question.timeLimit)
    setIsPaused(false)
  }, [question])

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleSubmit(new Event('submit') as React.FormEvent)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [question, isPaused])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedAnswer = answer.trim().toLowerCase()
    const isAnswerCorrect = trimmedAnswer === question.correctAnswer.toLowerCase()
    setIsCorrect(isAnswerCorrect)
    setShowFeedback(true)
    if (isAnswerCorrect) {
      setShowConfetti(true)
    }
    setTimeout(() => {
      setShowFeedback(false)
      onAnswer(answer)
      setAnswer('')
    }, 1500)
  }

  const getTimerColor = () => {
    const percentage = (timeLeft / question.timeLimit) * 100
    if (percentage > 66) return 'text-green-500'
    if (percentage > 33) return 'text-yellow-500'
    return 'text-red-500'
  }

  const togglePause = () => {
    setIsPaused(prev => !prev)
  }

  return (
    <div className={`p-4 rounded-lg ${showFeedback ? (isCorrect ? 'bg-green-100' : 'bg-red-100') : ''}`}>
      {showConfetti && <Confetti />}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-500">
          Question {currentQuestion} of {totalQuestions}
        </p>
        <div className="flex items-center gap-3">
          <div className={`flex items-center ${getTimerColor()}`}>
            <Timer className="w-5 h-5 mr-1" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
          <button
            onClick={togglePause}
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${isPaused ? 'text-green-500' : 'text-gray-500'}`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">{question.question}</h2>
      {question.type === 'image' && question.image && (
        <img src={question.image} alt="Question" className="w-full mb-4 rounded-lg shadow-md" />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type your answer here"
          disabled={showFeedback || isPaused}
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
          disabled={showFeedback || isPaused}
        >
          Submit Answer
        </button>
      </form>
      {showFeedback && (
        <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
          <p className="font-bold text-center">
            {isCorrect ? 'Correct! 🎉' : `Incorrect. The correct answer is: ${question.correctAnswer}`}
          </p>
        </div>
      )}
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Quiz Paused</h3>
            <button
              onClick={togglePause}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4" /> Resume Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion