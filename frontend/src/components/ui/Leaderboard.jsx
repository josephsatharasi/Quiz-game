import LeaderboardRow from './LeaderboardRow'

// leaderboard : full sorted array from getMockLeaderboard()
// topN        : how many rows to show (default 5)
// Socket migration: pass socket.on('leaderboard:update') payload as `leaderboard` prop
export default function Leaderboard({ leaderboard = [], topN = 5 }) {
  const top     = leaderboard.slice(0, topN)
  const myEntry = leaderboard.find((p) => p.isCurrentUser)
  const myInTop = myEntry ? myEntry.rank <= topN : false

  return (
    <div className="flex flex-col gap-1.5">
      {top.map((player, i) => (
        <div
          key={player.id}
          className="animate-slide-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          <LeaderboardRow player={player} />
        </div>
      ))}

      {/* Separator + student row when outside top N */}
      {myEntry && !myInTop && (
        <>
          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 border-t border-dashed border-slate-200" />
            <span className="text-xs text-slate-300 font-medium">···</span>
            <div className="flex-1 border-t border-dashed border-slate-200" />
          </div>
          <LeaderboardRow player={myEntry} />
        </>
      )}
    </div>
  )
}
