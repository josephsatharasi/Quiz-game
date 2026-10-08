import { useLocation, useNavigate } from 'react-router-dom'
import { Star, CheckCircle2, XCircle, Clock, Target, LogOut } from 'lucide-react'

import ResultRankDisplay   from '../../../components/ui/ResultRankDisplay'
import StatGrid            from '../../../components/ui/StatGrid'
import MotivationalMessage from '../../../components/ui/MotivationalMessage'
import Button              from '../../../components/ui/Button'
import Leaderboard         from '../../../components/ui/Leaderboard'
import Card                from '../../../components/ui/Card'
import { Trophy }          from 'lucide-react'

export default function ResultPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const name       = state?.name       ?? 'Student'
  const score      = state?.score      ?? 0
  const leaderboard = state?.leaderboard ?? []

  // Derive rank from leaderboard
  const myEntry = leaderboard.find((p) => p.name === name)
  const rank    = myEntry?.rank ?? (leaderboard.length + 1)
  const total   = leaderboard.length || 1

  const accuracy = 0  // server doesn't send per-question breakdown yet

  const stats = [
    { label: 'Final Score',     value: score.toLocaleString(), icon: Star,         accent: 'bg-amber-400' },
    { label: 'Final Position',  value: `#${rank}`,             icon: Star,         accent: rank <= 3 ? 'bg-amber-400' : 'bg-primary-500',
      sub: `of ${total} students` },
  ]

  return (
    <div className="flex flex-col gap-4 animate-slide-up w-full max-w-md mx-auto pb-8">

      <div className="text-center pt-2">
        <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Quiz Completed</p>
        <h1 className="text-2xl font-bold text-slate-800">Your Results</h1>
      </div>

      <ResultRankDisplay rank={rank} total={total} name={name} />

      <MotivationalMessage accuracy={rank <= Math.ceil(total * 0.3) ? 90 : 50} />

      <StatGrid stats={stats} />

      {leaderboard.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-2.5" style={{ backgroundColor: '#0f0e2a' }}>
            <Trophy size={18} className="text-amber-400" />
            <span className="text-sm font-bold text-white">Final Leaderboard</span>
          </div>
          <div className="p-4">
            <Leaderboard leaderboard={leaderboard} topN={10} />
          </div>
        </Card>
      )}

      <Button icon={LogOut} className="w-full" variant="ghost" onClick={() => navigate('/student/join')}>
        Exit Quiz
      </Button>

    </div>
  )
}
