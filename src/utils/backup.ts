import { Question } from '../types'
import { saveQuestions, loadQuestions } from './storage'

export const createBackup = (): string => {
  try {
    const questions = loadQuestions()
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: questions
    }
    const backupString = JSON.stringify(backup)
    const filename = `quiz-backup-${new Date().toISOString().slice(0,10)}.json`
    
    // Create and trigger download
    const blob = new Blob([backupString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return filename
  } catch (error) {
    throw new Error('Failed to create backup')
  }
}

export const restoreBackup = async (file: File): Promise<Question[]> => {
  try {
    const text = await file.text()
    const backup = JSON.parse(text)
    
    // Validate backup format
    if (!backup.version || !Array.isArray(backup.data)) {
      throw new Error('Invalid backup file format')
    }
    
    // Validate questions structure
    const questions = backup.data as Question[]
    const isValid = questions.every(q => 
      typeof q.id === 'string' &&
      typeof q.question === 'string' &&
      typeof q.correctAnswer === 'string' &&
      typeof q.timeLimit === 'number' &&
      (q.type === 'text' || q.type === 'image')
    )
    
    if (!isValid) {
      throw new Error('Backup contains invalid question format')
    }
    
    const saved = saveQuestions(questions)
    if (!saved) {
      throw new Error('Failed to restore questions')
    }
    
    return questions
  } catch (error) {
    throw new Error('Failed to restore backup: ' + (error as Error).message)
  }
}