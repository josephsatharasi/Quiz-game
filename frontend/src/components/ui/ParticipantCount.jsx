import { Users } from 'lucide-react'

export default function ParticipantCount({ count = 0 }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Users size={15} />
        <span className="text-xs font-medium uppercase tracking-wide">Participants</span>
      </div>
      <span className="text-3xl font-bold text-slate-800">{count}</span>
    </div>
  )
}
