import { BarChart2 } from 'lucide-react'
import LeaderboardRow from './LeaderboardRow'

// leaderboard : sorted array from getMockLeaderboard()
// currentName : string — to highlight the student's own row
export default function MiniLeaderboard({ leaderboard = [], currentName }) {
  if (!leaderboard.length) return null

  const top5       = leaderboard.slice(0, 5)
  const myEntry    = leaderboard.find((p) => p.isCurrentUser)
  const myInTop5   = myEntry ? myEntry.rank <= 5 : false
  const showMyRow  = myEntry && !myInTop5

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <BarChart2 size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Live Standings
        </span>
        {myEntry && (
          <span className="ml-auto text-xs font-semibold text-primary-600">
            Your rank: #{myEntry.rank}
          </span>
        )}
      </div>

      {/* Top 5 rows */}
      <div className="flex flex-col gap-1.5">
        {top5.map((player) => (
          <LeaderboardRow
            key={player.id}
            player={player}
            compact
          />
        ))}
      </div>

      {/* Separator + current student row if outside top 5 */}
      {showMyRow && (
        <>
          <div className="flex items-center gap-2 my-0.5">
            <div className="flex-1 border-t border-dashed border-slate-200" />
            <span className="text-xs text-slate-300">···</span>
            <div className="flex-1 border-t border-dashed border-slate-200" />
          </div>
          <LeaderboardRow player={myEntry} compact />
        </>
      )}
    </div>
  )
}
