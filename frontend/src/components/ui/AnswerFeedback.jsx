import { CheckCircle2, XCircle, Clock } from 'lucide-react'

const CONFIG = {
  correct: {
    icon:       CheckCircle2,
    iconClass:  'text-green-500',
    bg:         'bg-green-50 border-green-200',
    label:      'Correct!',
    labelClass: 'text-green-700',
    sub:        'Great answer',
    subClass:   'text-green-500',
  },
  wrong: {
    icon:       XCircle,
    iconClass:  'text-red-400',
    bg:         'bg-red-50 border-red-200',
    label:      'Incorrect',
    labelClass: 'text-red-600',
    sub:        'Better luck next time',
    subClass:   'text-red-400',
  },
  timeout: {
    icon:       Clock,
    iconClass:  'text-slate-400',
    bg:         'bg-slate-50 border-slate-200',
    label:      "Time's up!",
    labelClass: 'text-slate-600',
    sub:        'No answer submitted',
    subClass:   'text-slate-400',
  },
}

export default function AnswerFeedback({ result }) {
  const cfg = CONFIG[result]
  if (!cfg) return null
  const Icon = cfg.icon

  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border animate-scale-in ${cfg.bg}`}>
      <Icon size={32} className={`shrink-0 ${cfg.iconClass}`} />
      <div>
        <p className={`text-lg font-bold leading-tight ${cfg.labelClass}`}>{cfg.label}</p>
        <p className={`text-xs font-medium mt-0.5 ${cfg.subClass}`}>{cfg.sub}</p>
      </div>
    </div>
  )
}
