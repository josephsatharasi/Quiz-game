import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Users, BarChart2, Activity } from 'lucide-react'

import StatCard      from '../../../components/ui/StatCard'
import QuizCard      from '../../../components/ui/QuizCard'
import SectionHeader from '../../../components/ui/SectionHeader'
import Button        from '../../../components/ui/Button'
import EmptyState    from '../../../components/ui/EmptyState'
import Loading       from '../../../components/ui/Loading'
import { api }       from '../../../lib/api'
import { useAuth }   from '../../../context/AuthContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardPage() {
  const navigate       = useNavigate()
  const { teacher }    = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get('/quizzes')
      .then((d) => setQuizzes(d.quizzes))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleStart(quiz) {
    try {
      const data = await api.post(`/quizzes/${quiz._id}/session`, {})
      navigate(`/quiz/${data.session._id}/live`)
    } catch (e) {
      alert(e.message)
    }
  }

  const stats = [
    { id: 'quizzes',   label: 'Total Quizzes',     value: String(quizzes.length),                                          icon: BookOpen,  up: true  },
    { id: 'ready',     label: 'Ready to Use',       value: String(quizzes.filter((q) => q.status === 'ready').length),     icon: Activity,  up: true  },
    { id: 'questions', label: 'Total Questions',    value: String(quizzes.reduce((s, q) => s + (q.questionCount ?? 0), 0)), icon: BarChart2, up: true  },
    { id: 'drafts',    label: 'Drafts',             value: String(quizzes.filter((q) => q.status === 'draft').length),     icon: Users,     up: false },
  ]

  if (loading) return <Loading />

  return (
    <div className="flex flex-col gap-8 max-w-5xl animate-slide-up">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-widest mb-1">Teacher Portal</p>
          <h1 className="text-2xl font-bold text-slate-800">{getGreeting()}, {teacher?.name ?? 'Teacher'}</h1>
          <p className="text-sm text-slate-400 mt-1">Here's an overview of your classroom activity.</p>
        </div>
        <Button icon={Plus} size="md" onClick={() => navigate('/create')}>Create New Quiz</Button>
      </div>

      <section>
        <SectionHeader title="Quick Statistics" subtitle="Activity across all your quizzes" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {stats.map((s) => <StatCard key={s.id} label={s.label} value={s.value} up={s.up} icon={s.icon} />)}
        </div>
      </section>

      <section>
        <SectionHeader
          title="My Quizzes"
          subtitle={`${quizzes.length} quizzes in your library`}
          action={<Button icon={Plus} size="sm" variant="secondary" onClick={() => navigate('/create')}>New Quiz</Button>}
        />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {quizzes.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={BookOpen} title="No quizzes yet" description="Create your first quiz to get started." action={<Button icon={Plus} size="sm" onClick={() => navigate('/create')}>Create Quiz</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {quizzes.slice(0, 6).map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={{ ...quiz, id: quiz._id, questions: quiz.questionCount ?? 0, duration: `${(quiz.questionCount ?? 0) * (quiz.timePerQuestion ?? 20)}s`, lastUsed: new Date(quiz.updatedAt).toLocaleDateString(), students: 0, avgScore: 'N/A' }}
                onStart={() => handleStart(quiz)}
                onEdit={() => navigate(`/quizzes/${quiz._id}/edit`)}
                onResults={() => navigate('/results')}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
