import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Code2, BarChart2, Trophy, Users, X } from 'lucide-react'

import QuizTimer             from '../../../components/ui/QuizTimer'
import Loading               from '../../../components/ui/Loading'
import StudentAvatar         from '../../../components/ui/StudentAvatar'
import LiveQuizHeader        from '../components/LiveQuizHeader'
import AnswerDistributionBar from '../components/AnswerDistributionBar'
import TrainerControls       from '../components/TrainerControls'
import LiveLeaderboardPanel  from '../components/LiveLeaderboardPanel'

const SOCKET_URL = 'http://localhost:5000'

export default function LiveQuizPage() {
  const navigate      = useNavigate()
  const { id: sessionId } = useParams()
  const socketRef     = useRef(null)

  const [session,       setSession]       = useState(null)   // { pin, quiz, phase, currentQuestion, participants }
  const [phase,         setPhase]         = useState('idle')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timerKey,      setTimerKey]      = useState(0)
  const [participants,     setParticipants]     = useState(0)
  const [participantNames, setParticipantNames] = useState([])
  const [answeredCount, setAnsweredCount] = useState(0)
  const [distribution,  setDistribution]  = useState([])
  const [leaderboard,   setLeaderboard]   = useState([])
  const [correctId,     setCorrectId]     = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.emit('teacher:join', { sessionId })

    socket.on('session:state', (data) => {
      setSession(data)
      setPhase(data.phase)
      setQuestionIndex(data.currentQuestion)
      setParticipants(data.participants)
      setLoading(false)
    })

    socket.on('phase:change', (data) => {
      setPhase(data.phase)
      if (data.distribution) setDistribution(data.distribution)
      if (data.leaderboard)  setLeaderboard(data.leaderboard)
      if (data.correctId)    setCorrectId(data.correctId)
    })

    socket.on('question:next', (data) => {
      setQuestionIndex(data.questionIndex)
      setPhase('idle')
      setTimerKey((k) => k + 1)
      setAnsweredCount(0)
      setDistribution([])
      setCorrectId(null)
    })

    socket.on('participants:update', (data) => {
      setParticipants(data.count)
      if (data.names) setParticipantNames(data.names)
    })
    socket.on('answered:update',     (data) => setAnsweredCount(data.answeredCount))

    socket.on('quiz:ended', (data) => {
      setPhase('ended')
      if (data.leaderboard) setLeaderboard(data.leaderboard)
      setTimeout(() => navigate('/dashboard'), 3000)
    })

    socket.on('error', (data) => setError(data.message))

    return () => socket.disconnect()
  }, [sessionId])

  function handleAction(action) {
    socketRef.current?.emit('teacher:action', { action })
  }

  function handleKick(name) {
    socketRef.current?.emit('teacher:kick', { sessionId, name })
  }

  const handleTimeout = useCallback(() => {
    if (phase === 'running') handleAction('show_answer')
  }, [phase])

  if (loading) return <Loading fullScreen />
  if (error)   return <div className="flex items-center justify-center min-h-screen text-red-400 text-sm">{error}</div>
  if (!session) return null

  const question    = session.quiz.questions[questionIndex]
  const showAnswer  = phase === 'answer_shown' || phase === 'leaderboard_shown'
  const showLB      = phase === 'leaderboard_shown' || phase === 'ended'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0918' }}>

      <div className="px-5 pt-5 pb-3">
        <LiveQuizHeader
          title={session.quiz.title}
          pin={session.pin}
          participants={participants}
          answered={answeredCount}
          questionIndex={questionIndex}
          totalQuestions={session.quiz.totalQuestions}
        />
      </div>

      <div className="flex-1 flex gap-5 px-5 pb-5 min-h-0">

        {/* Left: question + distribution + controls */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                {phase === 'idle'              && 'Ready to start'}
                {phase === 'running'           && 'Question active'}
                {phase === 'paused'            && 'Paused'}
                {phase === 'answer_shown'      && 'Answer revealed'}
                {phase === 'leaderboard_shown' && 'Leaderboard shown'}
                {phase === 'ended'             && 'Quiz ended — redirecting…'}
              </span>
              <QuizTimer
                key={timerKey}
                duration={session.quiz.timePerQuestion}
                running={phase === 'running'}
                onTimeout={handleTimeout}
              />
            </div>

            <p className="text-2xl font-bold text-white leading-snug">{question?.text}</p>

            {question?.code && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                  <Code2 size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-400 font-medium">{session.quiz.subject}</span>
                </div>
                <pre className="px-5 py-4 text-lg text-emerald-300 font-mono overflow-x-auto leading-relaxed bg-slate-900/60">
                  <code>{question.code}</code>
                </pre>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {question?.options.map((opt) => {
                const isCorrect = showAnswer && opt.id === correctId
                return (
                  <div key={opt.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors ${isCorrect ? 'bg-green-500/20 border-green-500/60' : 'bg-white/5 border-white/10'}`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${isCorrect ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70'}`}>
                      {opt.label}
                    </span>
                    <span className={`text-base font-semibold ${isCorrect ? 'text-green-300' : 'text-white/80'}`}>{opt.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-primary-400" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Answer Distribution</span>
            </div>
            <AnswerDistributionBar distribution={distribution} correctId={correctId} showAnswer={showAnswer} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <TrainerControls phase={phase} onAction={handleAction} />
          </div>
        </div>

        {/* Right: waiting room / leaderboard */}
        <div className="w-72 shrink-0 flex flex-col gap-4">

          {/* Waiting room — show before quiz starts */}
          {phase === 'idle' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 flex flex-col overflow-hidden flex-1">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-violet-400" />
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Players</span>
                </div>
                <span className="text-xs font-bold text-white bg-violet-500/40 border border-violet-500/50 px-2 py-0.5 rounded-full">
                  {participantNames.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {participantNames.length === 0 ? (
                  <p className="text-center text-xs text-white/30 py-8">Waiting for students to join…</p>
                ) : (
                  participantNames.map((name, i) => (
                    <div key={name + i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                      <StudentAvatar name={name} size="sm" />
                      <span className="flex-1 text-sm font-medium text-white/80 truncate">{name}</span>
                      <button
                        onClick={() => handleKick(name)}
                        title="Remove player"
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Leaderboard — show during/after quiz */}
          {phase !== 'idle' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Trophy size={15} className="text-amber-400" />
                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Live Leaderboard</span>
              </div>

              <LiveLeaderboardPanel leaderboard={leaderboard} />

              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40 font-medium">Responses</span>
                  <span className="text-xs font-bold text-white">{answeredCount} / {participants}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: participants ? `${(answeredCount / participants) * 100}%` : '0%' }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-2 text-center">
                  {participants ? Math.round((answeredCount / participants) * 100) : 0}% of students responded
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
