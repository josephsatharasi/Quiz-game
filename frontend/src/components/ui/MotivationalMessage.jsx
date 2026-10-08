import { Flame, ThumbsUp, BookOpen, TrendingUp } from 'lucide-react'

const TIERS = [
  {
    min: 90,
    icon: Flame,
    message: 'Excellent performance!',
    sub: 'You ranked among the top performers. Outstanding work.',
    style: 'bg-amber-50 border-amber-200 text-amber-800',
    iconCls: 'text-amber-500',
  },
  {
    min: 70,
    icon: ThumbsUp,
    message: 'Great job!',
    sub: 'Strong result. A little more focus and you\'ll be at the top.',
    style: 'bg-green-50 border-green-200 text-green-800',
    iconCls: 'text-green-500',
  },
  {
    min: 50,
    icon: TrendingUp,
    message: 'Good effort!',
    sub: 'You\'re on the right track. Review the questions you missed.',
    style: 'bg-blue-50 border-blue-200 text-blue-800',
    iconCls: 'text-blue-500',
  },
  {
    min: 0,
    icon: BookOpen,
    message: 'Keep practicing!',
    sub: 'Every attempt builds knowledge. Review the material and try again.',
    style: 'bg-slate-50 border-slate-200 text-slate-700',
    iconCls: 'text-slate-400',
  },
]

export default function MotivationalMessage({ accuracy = 0 }) {
  const tier = TIERS.find((t) => accuracy >= t.min) ?? TIERS[TIERS.length - 1]
  const Icon = tier.icon

  return (
    <div className={`flex items-start gap-3 px-4 py-4 rounded-2xl border ${tier.style} animate-fade-in`}>
      <Icon size={20} className={`shrink-0 mt-0.5 ${tier.iconCls}`} />
      <div>
        <p className="text-sm font-bold">{tier.message}</p>
        <p className="text-xs mt-0.5 opacity-80">{tier.sub}</p>
      </div>
    </div>
  )
}
