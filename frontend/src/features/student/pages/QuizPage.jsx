import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Code2 } from 'lucide-react'

import Card            from '../../../components/ui/Card'
import QuizTimer       from '../../../components/ui/QuizTimer'
import AnswerOption    from '../../../components/ui/AnswerOption'
import QuizProgressBar from '../../../components/ui/QuizProgressBar'
import { useSocket }   from '../../../context/SocketContext'

export default function QuizPage() {
  const navigate        = useNavigate()
  const { state }       = useLocation()
  const socket          = useSocket()
  const answerStartTime = useRef(null)
  const answeredRef     = useRef(false)

  const [questionIndex, setQuestionIndex] = useState(state?.questionIndex ?? 0)
  const [score,         setScore]         = useState(state?.score ?? 0)
  const [timerKey,      setTimerKey]      = useState(0)
  const [phase,         setPhase]         = useState('idle')
  const [selected,      setSelected]      = useState(null)

  const questions      = state?.questions ?? []
  const question       = questions[questionIndex]
  const totalQuestions = state?.totalQuestions ?? questions.length
  const timePerQ       = state?.timePerQuestion ?? 20
  const currentName    = state?.name ?? 'You'
  const sessionId      = state?.sessionId

  // Listen for next question from teacher
  useEffect(() => {
    socket.on('question:next', ({ questionIndex: nextIdx }) => {
      setQuestionIndex(nextIdx)
      setPhase('idle')
      setSelected(null)
      setTimerKey((k) => k + 1)
      answeredRef.current = false
    })

    socket.on('quiz:ended', ({ leaderboard }) => {
      navigate('/student/result', {
        state: { name: currentName, score, leaderboard, sessionId },
      })
    })

    // Teacher showed answer — navigate to leaderboard
    socket.on('phase:change', ({ phase: newPhase, correctId, leaderboard }) => {
      if (newPhase === 'answer_shown' || newPhase === 'leaderboard_shown') {
        navigate('/student/leaderboard', {
          state: {
            ...state,
            questionIndex,
            score,
            correctId,
            leaderboard:       leaderboard ?? [],
            isLast:            questionIndex === totalQuestions - 1,
            isMidQuiz:         questionIndex < totalQuestions - 1,
            nextQuestionIndex: questionIndex + 1,
            feedback:          { correct: selected ? selected === correctId : false, pointsEarned: 0, totalScore: score, responseTime: null },
          },
        })
      }
    })

    return () => {
      socket.off('question:next')
      socket.off('quiz:ended')
      socket.off('phase:change')
    }
  }, [questionIndex, score, selected])

  // Listen for answer result from server
  useEffect(() => {
    socket.on('answer:result', ({ correct, pointsEarned, totalScore, responseTime }) => {
      setScore(totalScore)
      setPhase('answered')
      // Navigate to leaderboard with real feedback
      navigate('/student/leaderboard', {
        state: {
          ...state,
          questionIndex,
          score:             totalScore,
          isLast:            questionIndex === totalQuestions - 1,
          isMidQuiz:         questionIndex < totalQuestions - 1,
          nextQuestionIndex: questionIndex + 1,
          feedback:          { correct, pointsEarned, totalScore, responseTime },
          leaderboard:       [],   // will be populated when teacher shows leaderboard
        },
      })
    })
    return () => socket.off('answer:result')
  }, [questionIndex, totalQuestions, state])

  const handleTimerStart = useCallback(() => {
    answerStartTime.current = performance.now()
  }, [])

  function handleSelect(optionId) {
    if (phase !== 'idle' || answeredRef.current) return
    answeredRef.current = true
    const responseTime = answerStartTime.current
      ? +((performance.now() - answerStartTime.current) / 1000).toFixed(1)
      : timePerQ
    setSelected(optionId)
    setPhase('answered')
    socket.emit('student:answer', { sessionId, questionIndex, optionId, responseTime })
  }

  const handleTimeout = useCallback(() => {
    if (phase !== 'idle' || answeredRef.current) return
    answeredRef.current = true
    setPhase('timeout')
    // Submit timeout — no answer
    socket.emit('student:answer', { sessionId, questionIndex, optionId: null, responseTime: timePerQ })
  }, [phase, sessionId, questionIndex, timePerQ])

  function optionState(opt) {
    if (phase === 'idle') return 'idle'
    if (opt.id === selected) return 'disabled'  // server will confirm correct/wrong
    return 'disabled'
  }

  if (!state?.sessionId || !question) return <Navigate to="/student/join" replace />

  return (
    <div className="flex flex-col gap-4 animate-slide-up w-full max-w-md mx-auto">

      <QuizProgressBar current={questionIndex + 1} total={totalQuestions} score={score} name={currentName} />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {phase !== 'idle' ? 'Answer locked' : 'Choose your answer'}
          </p>
          <QuizTimer
            key={timerKey}
            duration={timePerQ}
            running={phase === 'idle'}
            onTimeout={handleTimeout}
            onStart={handleTimerStart}
          />
        </div>

        <div className="px-5 pb-4">
          <p className="text-base font-semibold text-slate-800 leading-relaxed">{question.text}</p>
          {question.code && (
            <div className="mt-3 rounded-xl bg-slate-900 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                <Code2 size={13} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">{state.subject ?? 'Code'}</span>
              </div>
              <pre className="px-4 py-3 text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                <code>{question.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100 mx-5" />

        <div className="flex flex-col gap-2.5 p-4">
          {question.options.map((opt) => (
            <AnswerOption
              key={opt.id}
              label={opt.label}
              text={opt.text}
              state={optionState(opt)}
              onClick={() => handleSelect(opt.id)}
            />
          ))}
        </div>
      </Card>

    </div>
  )
}
