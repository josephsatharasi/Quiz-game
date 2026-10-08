import { Plus, BookOpen, Users, BarChart2, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import StatCard     from '../../../components/ui/StatCard'
import QuizCard     from '../../../components/ui/QuizCard'
import SectionHeader from '../../../components/ui/SectionHeader'
import Button       from '../../../components/ui/Button'
import EmptyState   from '../../../components/ui/EmptyState'

import { MOCK_STATS, MOCK_QUIZZES } from '../data/mockTrainerData'

const STAT_ICONS = { quizzes: BookOpen, students: Users, conducted: Activity, avgscore: BarChart2 }

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-8 max-w-5xl animate-slide-up">

      {/* ── Greeting ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-widest mb-1">
            Trainer Portal
          </p>
          <h1 className="text-2xl font-bold text-slate-800">{getGreeting()}, Trainer</h1>
          <p className="text-sm text-slate-400 mt-1">Here's an overview of your classroom activity.</p>
        </div>
        <Button icon={Plus} size="md">Create New Quiz</Button>
      </div>

      {/* ── Stats grid ── */}
      <section>
        <SectionHeader title="Quick Statistics" subtitle="Activity across all your quizzes" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {MOCK_STATS.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              up={stat.up}
              icon={STAT_ICONS[stat.id]}
            />
          ))}
        </div>
      </section>

      {/* ── My Quizzes ── */}
      <section>
        <SectionHeader
          title="My Quizzes"
          subtitle={`${MOCK_QUIZZES.length} quizzes in your library`}
          action={
            <Button icon={Plus} size="sm" variant="secondary">
              New Quiz
            </Button>
          }
        />

        {MOCK_QUIZZES.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={BookOpen}
              title="No quizzes yet"
              description="Create your first quiz to get started."
              action={<Button icon={Plus} size="sm">Create Quiz</Button>}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {MOCK_QUIZZES.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStart={()   => navigate(`/trainer/quiz/${quiz.id}/live`)}
                onEdit={()    => console.log('edit',    quiz.id)}
                onResults={() => console.log('results', quiz.id)}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
