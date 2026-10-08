import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

export default function RankChange({ value = 0 }) {
  if (value > 0) return (
    <div className="flex items-center gap-0.5 text-green-600 animate-slide-up">
      <ArrowUp size={12} strokeWidth={2.5} />
      <span className="text-xs font-bold tabular-nums">{value}</span>
    </div>
  )
  if (value < 0) return (
    <div className="flex items-center gap-0.5 text-red-400 animate-slide-up">
      <ArrowDown size={12} strokeWidth={2.5} />
      <span className="text-xs font-bold tabular-nums">{Math.abs(value)}</span>
    </div>
  )
  return <Minus size={14} className="text-slate-300" />
}
