import RankBadge  from '../../../components/ui/RankBadge'
import RankChange  from '../../../components/ui/RankChange'
import StudentAvatar from '../../../components/ui/StudentAvatar'

export default function LiveLeaderboardPanel({ leaderboard = [] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {leaderboard.slice(0, 5).map((player, i) => (
        <div
          key={player.id}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors animate-slide-up"
          style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
        >
          <RankBadge rank={player.rank} size="sm" />
          <StudentAvatar name={player.name} size="sm" />
          <span className="flex-1 text-sm font-medium text-white/90 truncate">{player.name}</span>
          <RankChange value={player.rankChange} />
          <span className="text-sm font-bold text-white tabular-nums">{player.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
