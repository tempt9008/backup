import React, { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { createBackup, restoreBackup } from '../../utils/backup'
import { Question } from '../../types'

interface BackupControlsProps {
  onRestore: (questions: Question[]) => void
  onError: (error: string) => void
}

const BackupControls: React.FC<BackupControlsProps> = ({ onRestore, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBackup = async () => {
    try {
      const filename = createBackup()
      alert(`Backup created successfully: ${filename}`)
    } catch (error) {
      onError('Failed to create backup')
    }
  }

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const questions = await restoreBackup(file)
      onRestore(questions)
      alert('Backup restored successfully')
    } catch (error) {
      onError((error as Error).message)
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={handleBackup}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Backup
      </button>
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleRestore}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Restore Backup
        </button>
      </div>
    </div>
  )
}

export default BackupControls