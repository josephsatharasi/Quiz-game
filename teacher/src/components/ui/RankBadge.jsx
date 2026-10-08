import { Crown } from 'lucide-react'

const STYLES = {
  1: 'bg-amber-400 text-white shadow-sm shadow-amber-200',
  2: 'bg-slate-400 text-white',
  3: 'bg-amber-700 text-white',
}
const sizes = {
  sm: 'w-6 h-6 text-xs rounded-md',
  md: 'w-8 h-8 text-sm rounded-lg',
  lg: 'w-10 h-10 text-base rounded-xl',
}

export default function RankBadge({ rank, size = 'md' }) {
  const style = STYLES[rank] ?? 'bg-slate-100 text-slate-500'
  return (
    <div className={`flex items-center justify-center shrink-0 font-bold ${style} ${sizes[size]}`}>
      {rank === 1 ? <Crown size={size === 'lg' ? 18 : 13} /> : rank}
    </div>
  )
}
