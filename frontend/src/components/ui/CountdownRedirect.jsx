import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function CountdownRedirect({ seconds = 5, label = 'Next question', onComplete }) {
  const [remaining, setRemaining] = useState(seconds)
  const start = useRef(performance.now())

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (performance.now() - start.current) / 1000
      const left    = Math.max(0, seconds - elapsed)
      setRemaining(left)
      if (left === 0) { clearInterval(id); onComplete?.() }
    }, 50)
    return () => clearInterval(id)
  }, [seconds, onComplete])

  const pct = ((seconds - remaining) / seconds) * 100

  return (
    <div className="flex flex-col gap-2">
      {/* Progress track */}
      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {label} in <span className="font-semibold text-slate-600">{Math.ceil(remaining)}s</span>
        </span>
        <button
          onClick={onComplete}
          className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          Skip <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
