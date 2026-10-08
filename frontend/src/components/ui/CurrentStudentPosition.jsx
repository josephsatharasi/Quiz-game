import StudentAvatar from './StudentAvatar'
import RankBadge     from './RankBadge'
import RankChange    from './RankChange'

export default function CurrentStudentPosition({ player, total }) {
  if (!player) return null
  const { rank, name, score, rankChange } = player

  return (
    <div className="rounded-2xl border-2 border-primary-300 bg-primary-50 overflow-hidden">
      {/* Label */}
      <div className="px-4 py-2 bg-primary-600">
        <p className="text-xs font-bold text-white uppercase tracking-widest text-center">
          Your Position
        </p>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Rank */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <RankBadge rank={rank} size="lg" />
          <span className="text-xs text-slate-400 font-medium">
            of {total}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-primary-200 shrink-0" />

        {/* Avatar + name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <StudentAvatar name={name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary-800 truncate">{name}</p>
            <p className="text-xs text-primary-500 font-medium mt-0.5">
              {score.toLocaleString()} points
            </p>
          </div>
        </div>

        {/* Rank change */}
        <div className="shrink-0">
          <RankChange value={rankChange} />
        </div>
      </div>
    </div>
  )
}
