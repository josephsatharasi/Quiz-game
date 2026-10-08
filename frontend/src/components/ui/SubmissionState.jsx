import { useEffect, useState } from 'react'
import { ArrowRight, LayoutList } from 'lucide-react'
import AnswerFeedback  from './AnswerFeedback'
import ScoreAnimation  from './ScoreAnimation'
import MiniLeaderboard from './MiniLeaderboard'

export default function SubmissionState({
  result,
  feedback,
  isLast,
  onNext,
  onLeaderboard,
  leaderboard = [],
  currentName,
}) {
  const [showScore,       setShowScore]       = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowScore(true),       350)
    const t2 = setTimeout(() => setShowLeaderboard(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!result) return null

  return (
    <div className="flex flex-col gap-3 animate-slide-up">

      {/* Feedback banner */}
      <AnswerFeedback result={result} />

      {/* Score */}
      <div className="flex justify-center py-1">
        <ScoreAnimation
          pointsEarned={feedback.pointsEarned}
          totalScore={feedback.totalScore}
          show={showScore}
        />
      </div>

      {/* Response time */}
      {result !== 'timeout' && feedback.responseTime != null && (
        <p className="text-center text-xs text-slate-400">
          Response time:{' '}
          <span className="font-semibold text-slate-600">{feedback.responseTime}s</span>
        </p>
      )}

      {/* Live leaderboard */}
      {showLeaderboard && leaderboard.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 animate-slide-up">
          <MiniLeaderboard leaderboard={leaderboard} currentName={currentName} />
        </div>
      )}

      {/* CTA */}
      {isLast ? (
        <button
          onClick={onLeaderboard}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          <LayoutList size={16} />
          Final Leaderboard
        </button>
      ) : (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          Next Question
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
