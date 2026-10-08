import StudentAvatar from './StudentAvatar'
import RankBadge     from './RankBadge'
import RankChange    from './RankChange'

export default function LeaderboardRow({ player, compact = false }) {
  const { rank, name, score, rankChange, isCurrentUser } = player

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border transition-all duration-300
        ${isCurrentUser
          ? 'bg-primary-50 border-primary-200'
          : 'bg-white border-slate-100 hover:border-slate-200'}
        ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
    >
      <RankBadge rank={rank} size={compact ? 'sm' : 'md'} />

      <StudentAvatar name={name} size="sm" />

      <span className={`flex-1 text-sm truncate
        ${isCurrentUser ? 'font-semibold text-primary-700' : 'font-medium text-slate-700'}`}
      >
        {name}
        {isCurrentUser && (
          <span className="ml-1.5 text-xs font-normal text-primary-400">(you)</span>
        )}
      </span>

      <RankChange value={rankChange} />

      <span className={`text-sm font-bold tabular-nums min-w-[56px] text-right
        ${isCurrentUser ? 'text-primary-700' : 'text-slate-700'}`}
      >
        {score.toLocaleString()}
      </span>
    </div>
  )
}
