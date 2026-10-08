import { Play, Pencil, BarChart2, Clock, HelpCircle, Users, CalendarClock } from 'lucide-react'
import Badge from './Badge'

const STATUS = {
  ready: { label: 'Ready',  variant: 'success' },
  live:  { label: 'Live',   variant: 'danger'  },
  draft: { label: 'Draft',  variant: 'default' },
}

const SUBJECT_COLORS = {
  JavaScript: 'bg-amber-100 text-amber-700',
  Java:       'bg-blue-100 text-blue-700',
  C:          'bg-slate-100 text-slate-600',
  Python:     'bg-green-100 text-green-700',
  Web:        'bg-pink-100 text-pink-700',
}

export default function QuizCard({ quiz, onStart, onEdit, onResults }) {
  const { title, subject, questions, duration, lastUsed, students, avgScore, status } = quiz
  const subjectStyle = SUBJECT_COLORS[subject] ?? 'bg-primary-100 text-primary-700'
  const statusCfg    = STATUS[status] ?? STATUS.ready

  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-150 p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Title + badges */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${subjectStyle}`}>
              {subject}
            </span>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-snug">{title}</h3>
        </div>

        {/* Avg score */}
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-400">Avg. Score</p>
          <p className="text-base font-bold text-slate-800">{avgScore}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <HelpCircle size={13} className="text-slate-400" />
          {questions} questions
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={13} className="text-slate-400" />
          {duration}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users size={13} className="text-slate-400" />
          {students} students
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarClock size={13} className="text-slate-400" />
          {lastUsed}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={onStart}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors"
        >
          <Play size={13} />
          Start
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={onResults}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
        >
          <BarChart2 size={13} />
          Results
        </button>
      </div>
    </div>
  )
}
