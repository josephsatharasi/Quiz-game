import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, BookOpen, Trash2 } from 'lucide-react'
import Button        from '../../../components/ui/Button'
import QuizCard      from '../../../components/ui/QuizCard'
import SectionHeader from '../../../components/ui/SectionHeader'
import EmptyState    from '../../../components/ui/EmptyState'
import Loading       from '../../../components/ui/Loading'
import { api }       from '../../../lib/api'

const FILTERS = ['All', 'Ready', 'Draft', 'Live']

function toCardShape(quiz) {
  return {
    ...quiz,
    id:        quiz._id,
    questions: quiz.questionCount ?? 0,
    duration:  `${Math.round(((quiz.questionCount ?? 0) * (quiz.timePerQuestion ?? 20)) / 60)}m`,
    lastUsed:  new Date(quiz.updatedAt).toLocaleDateString(),
    students:  0,
    avgScore:  'N/A',
  }
}

export default function MyQuizzesPage() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('All')

  useEffect(() => {
    api.get('/quizzes')
      .then((d) => setQuizzes(d.quizzes))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this quiz?')) return
    try {
      await api.delete(`/quizzes/${id}`)
      setQuizzes((q) => q.filter((x) => x._id !== id))
    } catch (e) { alert(e.message) }
  }

  async function handleStart(quiz) {
    try {
      const data = await api.post(`/quizzes/${quiz._id}/session`, {})
      navigate(`/quiz/${data.session._id}/live`)
    } catch (e) { alert(e.message) }
  }

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                        q.subject.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || q.status === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  if (loading) return <Loading />

  return (
    <div className="flex flex-col gap-6 max-w-5xl animate-slide-up">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Quizzes</h1>
          <p className="text-sm text-slate-400 mt-0.5">{quizzes.length} quizzes in your library</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/create')}>Create Quiz</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No quizzes found"
          description={search ? `No results for "${search}"` : 'Create your first quiz to get started.'}
          action={!search && <Button icon={Plus} size="sm" onClick={() => navigate('/create')}>Create Quiz</Button>}
        />
      ) : (
        <>
          <SectionHeader title="Results" subtitle={`${filtered.length} quiz${filtered.length !== 1 ? 'zes' : ''} found`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((quiz) => (
              <div key={quiz._id} className="relative group">
                <QuizCard
                  quiz={toCardShape(quiz)}
                  onStart={() => handleStart(quiz)}
                  onEdit={() => navigate(`/quizzes/${quiz._id}/edit`)}
                  onResults={() => navigate('/results')}
                />
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
