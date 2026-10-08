import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, BarChart2 } from 'lucide-react'

import Card                   from '../../../components/ui/Card'
import AnswerFeedback         from '../../../components/ui/AnswerFeedback'
import ScoreAnimation         from '../../../components/ui/ScoreAnimation'
import Leaderboard            from '../../../components/ui/Leaderboard'
import CurrentStudentPosition from '../../../components/ui/CurrentStudentPosition'
import CountdownRedirect      from '../../../components/ui/CountdownRedirect'
import { useSocket }          from '../../../context/SocketContext'

export default function LeaderboardPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const socket    = useSocket()

  const feedback       = state?.feedback       ?? { correct: false, pointsEarned: 0, totalScore: 0, responseTime: null }
  const currentName    = state?.name           ?? 'You'
  const quizTitle      = state?.quizTitle      ?? 'Quiz'
  const questionIndex  = state?.questionIndex  ?? 0
  const totalQuestions = state?.totalQuestions ?? 0
  const isLast         = state?.isLast         ?? false
  const isMidQuiz      = state?.isMidQuiz      ?? true
  const score          = state?.score          ?? 0

  const [leaderboard, setLeaderboard] = useState(state?.leaderboard ?? [])

  // Update leaderboard when teacher shows it
  useEffect(() => {
    socket.on('phase:change', ({ phase, leaderboard: lb }) => {
      if (lb?.length) setLeaderboard(lb)

      // Teacher moved to next question
      if (phase === 'idle' || phase === 'running') {
        navigate('/student/quiz', {
          state: { ...state, questionIndex: state?.nextQuestionIndex ?? questionIndex + 1, score },
        })
      }
    })

    socket.on('question:next', ({ questionIndex: nextIdx }) => {
      navigate('/student/quiz', {
        state: { ...state, questionIndex: nextIdx, score },
      })
    })

    socket.on('quiz:ended', ({ leaderboard: lb }) => {
      if (lb?.length) setLeaderboard(lb)
      navigate('/student/result', {
        state: { name: currentName, score, leaderboard: lb, sessionId: state?.sessionId },
      })
    })

    return () => {
      socket.off('phase:change')
      socket.off('question:next')
      socket.off('quiz:ended')
    }
  }, [state, score, questionIndex])

  const myEntry = leaderboard.find((p) => p.name === currentName)
  const total   = leaderboard.length

  const result = feedback.correct
    ? 'correct'
    : feedback.responseTime === null && !feedback.correct
      ? 'timeout'
      : 'wrong'

  function goNext() {
    if (isLast) {
      navigate('/student/result', { state: { name: currentName, score, sessionId: state?.sessionId } })
    } else {
      navigate('/student/quiz', {
        state: { ...state, questionIndex: state?.nextQuestionIndex ?? questionIndex + 1, score },
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 animate-slide-up w-full max-w-md mx-auto pb-6">

      <AnswerFeedback result={result} />

      <div className="flex justify-center">
        <ScoreAnimation pointsEarned={feedback.pointsEarned} totalScore={feedback.totalScore} show />
      </div>

      {feedback.responseTime != null && (
        <p className="text-center text-xs text-slate-400">
          Response time: <span className="font-semibold text-slate-600">{feedback.responseTime}s</span>
        </p>
      )}

      <Card className="overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: '#0f0e2a' }}>
          <div className="flex items-center gap-2.5">
            {isLast
              ? <Trophy    size={18} className="text-amber-400" />
              : <BarChart2 size={18} className="text-primary-400" />
            }
            <span className="text-sm font-bold text-white">
              {isLast ? 'Final Leaderboard' : 'Leaderboard'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{quizTitle}</span>
            {!isLast && (
              <span className="text-xs font-semibold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                Q{questionIndex + 1}/{totalQuestions}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          {leaderboard.length > 0
            ? <Leaderboard leaderboard={leaderboard} topN={5} />
            : <p className="text-center text-sm text-slate-400 py-4">Waiting for leaderboard…</p>
          }
        </div>

        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          {isMidQuiz && !isLast ? (
            <CountdownRedirect seconds={5} label="Next question" onComplete={goNext} />
          ) : (
            <button
              onClick={goNext}
              className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
            >
              See Final Results
            </button>
          )}
        </div>
      </Card>

      <CurrentStudentPosition player={myEntry} total={total} />

    </div>
  )
}
