import { useEffect, useState } from 'react'
import { BarChart2, Users, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import Card          from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import Badge         from '../../../components/ui/Badge'
import RankBadge     from '../../../components/ui/RankBadge'
import StudentAvatar from '../../../components/ui/StudentAvatar'
import Loading       from '../../../components/ui/Loading'
import EmptyState    from '../../../components/ui/EmptyState'
import { api }       from '../../../lib/api'

function ScoreBar({ range, count, max }) {
  const pct = max ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-20 shrink-0">{range}</span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
    </div>
  )
}

function buildDistribution(topStudents, participants) {
  // Build rough score buckets from topStudents data
  // Real per-student scores would need a dedicated endpoint
  return [
    { range: 'Top 3',    count: Math.min(topStudents.length, 3) },
    { range: 'Others',   count: Math.max(0, participants - Math.min(topStudents.length, 3)) },
  ]
}

function ResultCard({ result }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700">{result.subject}</span>
              <Badge variant="success">Completed</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-800">{result.quizTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{result.conductedOn}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-primary-600">{result.avgScore}</p>
            <p className="text-xs text-slate-400">avg score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Users size={14} className="text-slate-400" />
            <div>
              <p className="text-sm font-bold text-slate-800">{result.participants}</p>
              <p className="text-xs text-slate-400">students</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <Trophy size={14} className="text-amber-500" />
            <div>
              <p className="text-sm font-bold text-slate-800">{result.topScore}</p>
              <p className="text-xs text-slate-400">top score</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {expanded && result.topStudents.length > 0 && (
        <div className="border-t border-slate-100 p-5 animate-slide-up">
          <SectionHeader title="Top Students" />
          <div className="flex flex-col gap-2 mt-3">
            {result.topStudents.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
                <RankBadge rank={i + 1} size="sm" />
                <StudentAvatar name={s.name} size="sm" />
                <span className="flex-1 text-sm font-medium text-slate-700">{s.name}</span>
                <span className="text-sm font-bold text-primary-600">{s.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function ResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get('/sessions')
      .then((d) => setResults(d.results))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="flex flex-col gap-6 max-w-3xl animate-slide-up">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <BarChart2 size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Results</h1>
          <p className="text-sm text-slate-400">{results.length} quiz{results.length !== 1 ? 'zes' : ''} conducted</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {results.length === 0 ? (
        <EmptyState icon={BarChart2} title="No results yet" description="Conduct a quiz to see results here." />
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((r) => <ResultCard key={r._id} result={r} />)}
        </div>
      )}

    </div>
  )
}
