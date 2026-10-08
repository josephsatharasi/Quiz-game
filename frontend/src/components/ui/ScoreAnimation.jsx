import { useEffect, useRef, useState } from 'react'
import { TrendingUp } from 'lucide-react'

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start     = performance.now()
    const startVal  = 0

    function tick(now) {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(startVal + eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export default function ScoreAnimation({ pointsEarned = 0, totalScore = 0, show = false }) {
  const displayScore = useCountUp(show ? totalScore  : 0, 900)
  const displayPts   = useCountUp(show ? pointsEarned : 0, 600)

  if (!show) return null

  return (
    <div className="flex flex-col items-center gap-1 animate-score-pop">
      {/* Points earned badge */}
      <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold
        ${pointsEarned > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
      >
        <TrendingUp size={14} />
        {pointsEarned > 0 ? `+${displayPts.toLocaleString()} points` : '+0 points'}
      </div>

      {/* Total score */}
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-bold text-slate-800 tabular-nums">
          {displayScore.toLocaleString()}
        </span>
        <span className="text-sm text-slate-400 font-medium">total</span>
      </div>
    </div>
  )
}
