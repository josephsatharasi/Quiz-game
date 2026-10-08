import { Play, Pause, Eye, BarChart2, SkipForward, StopCircle } from 'lucide-react'

// phase: 'idle' | 'running' | 'paused' | 'answer_shown' | 'leaderboard_shown' | 'ended'
const BUTTONS = [
  {
    id:       'start',
    label:    'Start Question',
    icon:     Play,
    style:    'bg-green-600 hover:bg-green-500 text-white',
    enabled:  (p) => p === 'idle',
  },
  {
    id:       'pause',
    label:    'Pause',
    icon:     Pause,
    style:    'bg-amber-500 hover:bg-amber-400 text-white',
    enabled:  (p) => p === 'running',
  },
  {
    id:       'resume',
    label:    'Resume',
    icon:     Play,
    style:    'bg-amber-500 hover:bg-amber-400 text-white',
    enabled:  (p) => p === 'paused',
  },
  {
    id:       'show_answer',
    label:    'Show Answer',
    icon:     Eye,
    style:    'bg-primary-600 hover:bg-primary-500 text-white',
    enabled:  (p) => p === 'running' || p === 'paused',
  },
  {
    id:       'show_leaderboard',
    label:    'Show Leaderboard',
    icon:     BarChart2,
    style:    'bg-indigo-600 hover:bg-indigo-500 text-white',
    enabled:  (p) => p === 'answer_shown',
  },
  {
    id:       'next',
    label:    'Next Question',
    icon:     SkipForward,
    style:    'bg-primary-600 hover:bg-primary-500 text-white',
    enabled:  (p) => p === 'answer_shown' || p === 'leaderboard_shown',
  },
  {
    id:       'end',
    label:    'End Quiz',
    icon:     StopCircle,
    style:    'bg-red-600 hover:bg-red-500 text-white',
    enabled:  (p) => p !== 'idle' && p !== 'ended',
  },
]

export default function TrainerControls({ phase = 'idle', onAction }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BUTTONS.map(({ id, label, icon: Icon, style, enabled }) => {
        const active = enabled(phase)
        return (
          <button
            key={id}
            onClick={() => active && onAction(id)}
            disabled={!active}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${active ? style : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'}`}
          >
            <Icon size={15} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
