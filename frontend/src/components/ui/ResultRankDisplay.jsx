import { Crown, Medal } from 'lucide-react'
import StudentAvatar from './StudentAvatar'

const TOP3 = {
  1: {
    ring:   'ring-4 ring-amber-300 ring-offset-2',
    badge:  'bg-amber-400 text-white shadow-lg shadow-amber-200',
    glow:   'bg-amber-50 border-amber-200',
    label:  '1st Place',
    icon:   Crown,
    iconCls:'text-amber-500',
  },
  2: {
    ring:   'ring-4 ring-slate-300 ring-offset-2',
    badge:  'bg-slate-400 text-white shadow-md',
    glow:   'bg-slate-50 border-slate-200',
    label:  '2nd Place',
    icon:   Medal,
    iconCls:'text-slate-400',
  },
  3: {
    ring:   'ring-4 ring-amber-600/50 ring-offset-2',
    badge:  'bg-amber-700 text-white shadow-md',
    glow:   'bg-amber-50/60 border-amber-200',
    label:  '3rd Place',
    icon:   Medal,
    iconCls:'text-amber-700',
  },
}

export default function ResultRankDisplay({ rank, total, name }) {
  const cfg = TOP3[rank]

  if (cfg) {
    const Icon = cfg.icon
    return (
      <div className={`flex flex-col items-center py-7 px-6 rounded-2xl border ${cfg.glow} animate-scale-in`}>
        {/* Floating icon */}
        <Icon size={32} className={`mb-3 animate-float ${cfg.iconCls}`} />

        {/* Avatar with ring */}
        <div className={`rounded-full ${cfg.ring} mb-3`}>
          <StudentAvatar name={name} size="lg" />
        </div>

        {/* Rank badge */}
        <div className={`px-4 py-1 rounded-full text-sm font-bold mb-1 ${cfg.badge}`}>
          {cfg.label}
        </div>

        <p className="text-xs text-slate-400 font-medium">out of {total} participants</p>
      </div>
    )
  }

  // Rank 4+
  return (
    <div className="flex flex-col items-center py-6 px-6 rounded-2xl border border-slate-100 bg-white animate-scale-in">
      <div className="relative mb-3">
        <StudentAvatar name={name} size="lg" />
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
          {rank}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-800">#{rank}</p>
      <p className="text-xs text-slate-400 font-medium">out of {total} participants</p>
    </div>
  )
}
