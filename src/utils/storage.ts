import { Question } from '../types'

const STORAGE_KEY = 'quizQuestions'
const MAX_QUESTIONS = 100
const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024 // 4.5MB limit

export const saveQuestions = (questions: Question[]): boolean => {
  try {
    if (questions.length > MAX_QUESTIONS) {
      throw new Error(`Maximum number of questions (${MAX_QUESTIONS}) exceeded`)
    }

    const serializedQuestions = JSON.stringify(questions)
    if (serializedQuestions.length > MAX_STORAGE_SIZE) {
      throw new Error('Storage size limit exceeded')
    }

    localStorage.setItem(STORAGE_KEY, serializedQuestions)
    return true
  } catch (error) {
    console.error('Failed to save questions:', error)
    return false
  }
}

export const loadQuestions = (): Question[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load questions:', error)
    return []
  }
}

export const clearQuestions = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}