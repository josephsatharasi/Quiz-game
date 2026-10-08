import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, BarChart2, Trophy } from 'lucide-react'

import QuizTimer              from '../../../components/ui/QuizTimer'
import RankBadge              from '../../../components/ui/RankBadge'
import LiveQuizHeader         from '../components/LiveQuizHeader'
import AnswerDistributionBar  from '../components/AnswerDistributionBar'
import TrainerControls        from '../components/TrainerControls'
import LiveLeaderboardPanel   from '../components/LiveLeaderboardPanel'

import {
  MOCK_SESSION,
  MOCK_QUESTIONS,
  MOCK_QUIZ,
  getMockDistribution,
  MOCK_LIVE_LEADERBOARD,
} from '../data/mockLiveQuiz'

// ── Phase machine ─────────────────────────────────────────────────────────────
// idle → running → (paused ↔ running) → answer_shown → leaderboard_shown → idle (next q)
// Any phase → ended
// Socket migration: drive phase transitions from socket events instead of local state

const PHASE_TRANSITIONS = {
  start:            'running',
  pause:            'paused',
  resume:           'running',
  show_answer:      'answer_shown',
  show_leaderboard: 'leaderboard_shown',
  next:             'next_question', // handled specially
  end:              'ended',
}

export default function LiveQuizPage() {
  const navigate = useNavigate()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase]                 = useState('idle')
  const [timerKey, setTimerKey]           = useState(0)
  const [answeredCount, setAnsweredCount] = useState(MOCK_SESSION.answeredCount)

  const question     = MOCK_QUESTIONS[questionIndex]
  const distribution = getMockDistribution(questionIndex, MOCK_SESSION.participantCount)
  const showAnswer   = phase === 'answer_shown' || phase === 'leaderboard_shown'
  const showLB       = phase === 'leaderboard_shown'
  const isLast       = questionIndex === MOCK_QUESTIONS.length - 1

  // ── Control handler (Socket: replace with socket.emit calls) ──────────────
  function handleAction(actionId) {
    if (actionId === 'next_question' || actionId === 'next') {
      if (isLast) { setPhase('ended'); return }
      setQuestionIndex((i) => i + 1)
      setPhase('idle')
      setTimerKey((k) => k + 1)
      setAnsweredCount(0)
      return
    }
    if (actionId === 'end') {
      setPhase('ended')
      navigate('/trainer/dashboard')
      return
    }
    const next = PHASE_TRANSITIONS[actionId]
    if (next) setPhase(next)
  }

  const handleTimeout = useCallback(() => {
    if (phase === 'running') setPhase('answer_shown')
  }, [phase])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0918' }}>

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3">
        <LiveQuizHeader
          title={MOCK_SESSION.quizTitle}
          pin={MOCK_SESSION.pin}
          participants={MOCK_SESSION.participantCount}
          answered={answeredCount}
          questionIndex={questionIndex}
          totalQuestions={MOCK_QUIZ.totalQuestions}
        />
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex gap-5 px-5 pb-5 min-h-0">

        {/* ── Left: question + distribution ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Question card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">

            {/* Timer + phase label */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                {phase === 'idle'              && 'Ready to start'}
                {phase === 'running'           && 'Question active'}
                {phase === 'paused'            && 'Paused'}
                {phase === 'answer_shown'      && 'Answer revealed'}
                {phase === 'leaderboard_shown' && 'Leaderboard shown'}
                {phase === 'ended'             && 'Quiz ended'}
              </span>
              <QuizTimer
                key={timerKey}
                duration={MOCK_QUIZ.timePerQuestion}
                running={phase === 'running'}
                onTimeout={handleTimeout}
              />
            </div>

            {/* Question text */}
            <p className="text-2xl font-bold text-white leading-snug">
              {question.text}
            </p>

            {/* Code block */}
            {question.code && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                  <Code2 size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-400 font-medium">JavaScript</span>
                </div>
                <pre className="px-5 py-4 text-lg text-emerald-300 font-mono overflow-x-auto leading-relaxed bg-slate-900/60">
                  <code>{question.code}</code>
                </pre>
              </div>
            )}

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isCorrect = showAnswer && opt.id === question.correctId
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors
                      ${isCorrect
                        ? 'bg-green-500/20 border-green-500/60'
                        : 'bg-white/5 border-white/10'}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
                      ${isCorrect ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70'}`}
                    >
                      {opt.label}
                    </span>
                    <span className={`text-base font-semibold ${isCorrect ? 'text-green-300' : 'text-white/80'}`}>
                      {opt.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Answer distribution */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-primary-400" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Answer Distribution
              </span>
            </div>
            <AnswerDistributionBar
              distribution={distribution}
              correctId={question.correctId}
              showAnswer={showAnswer}
            />
          </div>

          {/* Controls */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <TrainerControls phase={phase} onAction={handleAction} />
          </div>
        </div>

        {/* ── Right sidebar: leaderboard ── */}
        <div className="w-72 shrink-0 flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Trophy size={15} className="text-amber-400" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Live Leaderboard
              </span>
            </div>

            <LiveLeaderboardPanel leaderboard={MOCK_LIVE_LEADERBOARD} />

            {/* Participant answered progress */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 font-medium">Responses</span>
                <span className="text-xs font-bold text-white">
                  {answeredCount} / {MOCK_SESSION.participantCount}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / MOCK_SESSION.participantCount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-2 text-center">
                {Math.round((answeredCount / MOCK_SESSION.participantCount) * 100)}% of students responded
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
