import { Star } from 'lucide-react'
import StudentAvatar from './StudentAvatar'

export default function QuizProgressBar({ current, total, score, name }) {
  const pct = ((current - 1) / total) * 100

  return (
    <div className="flex flex-col gap-2">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {name && <StudentAvatar name={name} size="xs" />}
          <span className="text-sm font-semibold text-slate-700">
            Q<span className="text-primary-600">{current}</span>
            <span className="text-slate-400">/{total}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          <Star size={13} className="text-amber-500 fill-amber-400" />
          <span className="text-xs font-bold text-amber-700 tabular-nums">{score.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
