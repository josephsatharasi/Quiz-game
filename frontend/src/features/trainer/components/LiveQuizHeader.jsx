import { Hash, Users, GraduationCap, CheckCircle2 } from 'lucide-react'

export default function LiveQuizHeader({ title, pin, participants, answered, questionIndex, totalQuestions }) {
  const progress = (questionIndex / totalQuestions) * 100

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Live Quiz</p>
            <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
          </div>
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <Hash size={14} className="text-primary-400" />
            <span className="text-xs text-white/60 font-medium">PIN</span>
            <span className="text-base font-bold text-white tracking-widest">{pin}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <Users size={14} className="text-green-400" />
            <span className="text-base font-bold text-white">{participants}</span>
            <span className="text-xs text-white/60 font-medium">joined</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <CheckCircle2 size={14} className="text-amber-400" />
            <span className="text-base font-bold text-white">{answered}</span>
            <span className="text-xs text-white/60 font-medium">answered</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-600/80 border border-primary-500 rounded-xl px-4 py-2">
            <span className="text-base font-bold text-white">Q {questionIndex + 1}</span>
            <span className="text-white/50 text-sm font-medium">/ {totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
