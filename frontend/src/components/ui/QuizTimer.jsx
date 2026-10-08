import { useEffect, useRef, useState } from 'react'

const RADIUS = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function QuizTimer({ duration = 20, onTimeout, onStart, running = true }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef(null)

  // Reset when duration changes (new question)
  useEffect(() => {
    setTimeLeft(duration)
    if (running) onStart?.()
  }, [duration])

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) { onTimeout?.(); return }

    intervalRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(intervalRef.current)
  }, [timeLeft, running])

  const progress   = timeLeft / duration           // 1 → 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  const isLow      = timeLeft <= 5 && timeLeft > 0
  const isOut      = timeLeft === 0

  const trackColor  = isOut ? '#fca5a5' : isLow ? '#fcd34d' : '#ddd6fe'
  const strokeColor = isOut ? '#ef4444' : isLow ? '#f59e0b' : '#7c3aed'
  const textColor   = isOut ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-primary-700'

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className={`-rotate-90 ${isLow && !isOut ? 'animate-pulse' : ''}`}>
        {/* Track */}
        <circle cx="32" cy="32" r={RADIUS} fill="none" stroke={trackColor} strokeWidth="4" />
        {/* Progress arc */}
        <circle
          cx="32" cy="32" r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`absolute text-lg font-bold tabular-nums ${textColor}`}>
        {timeLeft}
      </span>
    </div>
  )
}
