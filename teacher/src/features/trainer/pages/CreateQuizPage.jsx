import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Save, ArrowLeft, GripVertical, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import Button        from '../../../components/ui/Button'
import Input         from '../../../components/ui/Input'
import Card          from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import Loading       from '../../../components/ui/Loading'
import ExcelUpload   from '../components/ExcelUpload'
import { api }       from '../../../lib/api'

const SUBJECTS = ['JavaScript', 'Java', 'Python', 'C', 'C++', 'Web', 'SQL', 'Other']
const OPTION_COLORS = { a: 'bg-blue-500', b: 'bg-green-500', c: 'bg-amber-500', d: 'bg-rose-500' }

function emptyQuestion() {
  return {
    _id:       crypto.randomUUID(),
    text:      '',
    code:      '',
    options:   [
      { id: 'a', label: 'A', text: '' },
      { id: 'b', label: 'B', text: '' },
      { id: 'c', label: 'C', text: '' },
      { id: 'd', label: 'D', text: '' },
    ],
    correctId: 'a',
  }
}

function QuestionCard({ question, index, onChange, onDelete, total }) {
  function setField(field, value) { onChange({ ...question, [field]: value }) }
  function setOption(optId, text) {
    onChange({ ...question, options: question.options.map((o) => o.id === optId ? { ...o, text } : o) })
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-slate-300 cursor-grab" />
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Q{index + 1}</span>
        </div>
        {total > 1 && (
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Input label="Question" placeholder="Enter your question..." value={question.text} onChange={(e) => setField('text', e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Code Snippet (optional)</label>
          <textarea
            rows={3}
            placeholder="console.log('optional code block');"
            value={question.code}
            onChange={(e) => setField('code', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm font-mono outline-none resize-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Answer Options</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {question.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${OPTION_COLORS[opt.id]}`}>
                  {opt.label}
                </span>
                <input
                  type="text"
                  placeholder={`Option ${opt.label}`}
                  value={opt.text}
                  onChange={(e) => setOption(opt.id, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm outline-none transition-colors"
                />
                <input
                  type="radio"
                  name={`correct-${question._id}`}
                  checked={question.correctId === opt.id}
                  onChange={() => setField('correctId', opt.id)}
                  className="w-4 h-4 accent-primary-600 shrink-0"
                  title="Mark as correct"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">Select the radio button next to the correct answer.</p>
        </div>
      </div>
    </Card>
  )
}

export default function CreateQuizPage() {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const isEdit      = Boolean(id)

  const [title,     setTitle]     = useState('')
  const [subject,   setSubject]   = useState('JavaScript')
  const [timeLimit, setTimeLimit] = useState(20)
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [saving,    setSaving]    = useState(false)
  const [loading,   setLoading]   = useState(isEdit)
  const [errors,    setErrors]    = useState({})

  // Load existing quiz when editing
  useEffect(() => {
    if (!isEdit) return
    api.get(`/quizzes/${id}`)
      .then((d) => {
        setTitle(d.quiz.title)
        setSubject(d.quiz.subject)
        setTimeLimit(d.quiz.timePerQuestion)
        setQuestions(d.quiz.questions.length ? d.quiz.questions.map((q) => ({ ...q, _id: q._id ?? crypto.randomUUID() })) : [emptyQuestion()])
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false))
  }, [id])

  function addQuestion() { setQuestions((q) => [...q, emptyQuestion()]) }
  function importQuestions(imported) { setQuestions((q) => [...q.filter((x) => x.text.trim()), ...imported]) }

  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['question', 'code', 'option_a', 'option_b', 'option_c', 'option_d', 'correct'],
      ['What is 2 + 2?', '', '3', '4', '5', '6', 'b'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Questions')
    XLSX.writeFile(wb, 'quiz_template.xlsx')
  }
  function updateQuestion(i, updated) { setQuestions((q) => q.map((item, idx) => idx === i ? updated : item)) }
  function deleteQuestion(i) { setQuestions((q) => q.filter((_, idx) => idx !== i)) }

  function validate() {
    const errs = {}
    if (!title.trim()) errs.title = 'Quiz title is required.'
    questions.forEach((q, i) => {
      if (!q.text.trim()) errs[`q${i}`] = `Question ${i + 1} text is required.`
      if (q.options.some((o) => !o.text.trim())) errs[`q${i}opts`] = `All options for Q${i + 1} must be filled.`
    })
    return errs
  }

  async function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      const body = { title, subject, timePerQuestion: timeLimit, questions }
      if (isEdit) {
        await api.put(`/quizzes/${id}`, body)
      } else {
        await api.post('/quizzes', body)
      }
      navigate('/quizzes')
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="flex flex-col gap-6 max-w-3xl animate-slide-up">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h1>
            <p className="text-sm text-slate-400">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={downloadTemplate} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold transition-colors" title="Download Excel template">
            <Download size={13} />Template
          </button>
          <ExcelUpload onImport={importQuestions} />
          <Button icon={Save} loading={saving} onClick={handleSave}>{isEdit ? 'Save Changes' : 'Save Quiz'}</Button>
        </div>
      </div>

      <Card className="p-5">
        <SectionHeader title="Quiz Settings" subtitle="Basic information about your quiz" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="sm:col-span-2">
            <Input label="Quiz Title" placeholder="e.g. JavaScript Operators" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm outline-none bg-white transition-colors">
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Time per question (sec)</label>
            <input type="number" min={5} max={120} value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm outline-none transition-colors" />
          </div>
        </div>
      </Card>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-red-700 mb-1">Please fix the following:</p>
          <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
            {Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <QuestionCard key={q._id} question={q} index={i} total={questions.length}
            onChange={(u) => updateQuestion(i, u)} onDelete={() => deleteQuestion(i)} />
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 text-slate-400 hover:text-primary-600 text-sm font-semibold transition-colors"
      >
        <Plus size={16} />Add Question
      </button>

    </div>
  )
}
