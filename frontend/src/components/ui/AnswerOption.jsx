import { CheckCircle2, XCircle } from 'lucide-react'

const STATE_STYLES = {
  idle:     'bg-white border-slate-200 text-slate-700 hover:border-primary-400 hover:bg-primary-50 cursor-pointer',
  selected: 'bg-primary-50 border-primary-500 text-primary-800 cursor-pointer',
  correct:  'bg-green-50 border-green-500 text-green-800 cursor-default',
  wrong:    'bg-red-50 border-red-400 text-red-700 cursor-default',
  disabled: 'bg-slate-50 border-slate-100 text-slate-400 cursor-default',
}

const LABEL_STYLES = {
  idle:     'bg-slate-100 text-slate-500',
  selected: 'bg-primary-500 text-white',
  correct:  'bg-green-500 text-white',
  wrong:    'bg-red-400 text-white',
  disabled: 'bg-slate-200 text-slate-400',
}

export default function AnswerOption({ label, text, state = 'idle', onClick }) {
  const isCorrect = state === 'correct'
  const isWrong   = state === 'wrong'

  return (
    <button
      onClick={state === 'idle' || state === 'selected' ? onClick : undefined}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all duration-150 ${STATE_STYLES[state]}`}
    >
      {/* Label badge */}
      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${LABEL_STYLES[state]}`}>
        {label}
      </span>

      {/* Answer text */}
      <span className="flex-1 text-sm font-medium leading-snug">{text}</span>

      {/* Result icon */}
      {isCorrect && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
      {isWrong   && <XCircle     size={18} className="text-red-400  shrink-0" />}
    </button>
  )
}
