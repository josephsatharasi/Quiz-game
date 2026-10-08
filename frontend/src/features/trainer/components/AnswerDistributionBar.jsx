import { CheckCircle2 } from 'lucide-react'

const OPTION_COLORS = {
  a: { bar: 'bg-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-300'   },
  b: { bar: 'bg-green-500',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-300'  },
  c: { bar: 'bg-amber-500',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-300'  },
  d: { bar: 'bg-rose-500',   bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-300'   },
}

export default function AnswerDistributionBar({ distribution = [], correctId, showAnswer = false }) {
  const max = Math.max(...distribution.map((d) => d.count), 1)

  return (
    <div className="flex flex-col gap-2.5">
      {distribution.map((opt) => {
        const colors    = OPTION_COLORS[opt.id] ?? OPTION_COLORS.a
        const isCorrect = showAnswer && opt.id === correctId
        const widthPct  = (opt.count / max) * 100

        return (
          <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border ${colors.bg} ${colors.border}`}>
            {/* Label */}
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
              ${isCorrect ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}
            >
              {opt.label}
            </span>

            {/* Bar track */}
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isCorrect ? 'bg-green-500' : colors.bar}`}
                style={{ width: `${widthPct}%` }}
              />
            </div>

            {/* Count + percent */}
            <div className="flex items-center gap-2 shrink-0 min-w-[72px] justify-end">
              <span className={`text-sm font-bold ${colors.text}`}>{opt.count}</span>
              <span className="text-xs text-white/40 font-medium">{opt.percent}%</span>
              {isCorrect && <CheckCircle2 size={15} className="text-green-400" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
