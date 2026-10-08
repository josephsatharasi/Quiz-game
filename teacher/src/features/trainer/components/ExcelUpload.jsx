import { useRef } from 'react'
import * as XLSX from 'xlsx'
import { Upload } from 'lucide-react'

// Expected columns: question | code | option_a | option_b | option_c | option_d | correct
export default function ExcelUpload({ onImport }) {
  const inputRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' })
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' })

        const questions = []
        const errors = []

        rows.forEach((row, i) => {
          const n = i + 2 // row number in sheet (1-indexed + header)
          const text = String(row['question'] ?? '').trim()
          const optA = String(row['option_a'] ?? '').trim()
          const optB = String(row['option_b'] ?? '').trim()
          const optC = String(row['option_c'] ?? '').trim()
          const optD = String(row['option_d'] ?? '').trim()
          const correct = String(row['correct'] ?? '').trim().toLowerCase()

          if (!text) { errors.push(`Row ${n}: "question" is empty`); return }
          if (!optA || !optB || !optC || !optD) { errors.push(`Row ${n}: all option columns required`); return }
          if (!['a', 'b', 'c', 'd'].includes(correct)) { errors.push(`Row ${n}: "correct" must be a, b, c, or d`); return }

          questions.push({
            _id: crypto.randomUUID(),
            text,
            code: String(row['code'] ?? '').trim(),
            options: [
              { id: 'a', label: 'A', text: optA },
              { id: 'b', label: 'B', text: optB },
              { id: 'c', label: 'C', text: optC },
              { id: 'd', label: 'D', text: optD },
            ],
            correctId: correct,
          })
        })

        if (errors.length) {
          alert(`Import errors:\n${errors.join('\n')}`)
          if (!questions.length) return
        }

        onImport(questions)
      } catch {
        alert('Failed to read the Excel file. Make sure it is a valid .xlsx file.')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <>
      <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-primary-400 hover:bg-primary-50 text-slate-600 hover:text-primary-600 text-sm font-semibold transition-colors"
      >
        <Upload size={15} />
        Import from Excel
      </button>
    </>
  )
}
