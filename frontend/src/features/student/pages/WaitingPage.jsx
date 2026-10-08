import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { GraduationCap, Hash, Users } from 'lucide-react'

import StudentAvatar from '../../../components/ui/StudentAvatar'
import { useSocket } from '../../../context/SocketContext'

function PlayerCard({ name, isMe, index }) {
  return (
    <div
      className="flex flex-col items-center gap-2 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      {/* Avatar with glow ring for self */}
      <div className="relative">
        <div className={`rounded-full p-0.5 ${isMe
          ? 'bg-gradient-to-br from-violet-400 to-indigo-400'
          : 'bg-white/10'}`}>
          <StudentAvatar name={name} size="lg" />
        </div>
        {isMe && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0f0e2a] shadow" />
        )}
      </div>

      {/* Name */}
      <span className={`text-xs font-semibold text-center leading-tight w-16 truncate
        ${isMe ? 'text-violet-300' : 'text-white/70'}`}>
        {isMe ? `${name} (you)` : name}
      </span>
    </div>
  )
}

function Orb({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-15 pointer-events-none ${className}`} />
}

export default function WaitingPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const socket     = useSocket()

  const [participants, setParticipants] = useState([])
  const [connStatus,   setConnStatus]   = useState('connecting')

  useEffect(() => {
    if (!state?.sessionId || !state?.name) return

    socket.emit('student:join', { sessionId: state.sessionId, name: state.name })

    socket.on('connect',       () => setConnStatus('connected'))
    socket.on('disconnect',    () => setConnStatus('disconnected'))
    socket.on('connect_error', () => setConnStatus('error'))

    socket.on('student:joined', ({ phase, currentQuestion }) => {
      setConnStatus('connected')
      if (phase === 'running') {
        navigate('/student/quiz', { state: { ...state, questionIndex: currentQuestion } })
      }
    })

    socket.on('participants:update', ({ names }) => {
      if (names) setParticipants(names)
    })

    socket.on('kicked', () => {
      navigate('/student/join', { replace: true, state: { kicked: true } })
    })

    socket.on('phase:change', ({ phase, questionIndex }) => {
      if (phase === 'running') {
        navigate('/student/quiz', { state: { ...state, questionIndex } })
      }
    })

    return () => {
      socket.off('student:joined')
      socket.off('participants:update')
      socket.off('phase:change')
      socket.off('kicked')
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
    }
  }, [state?.sessionId])

  if (!state?.pin || !state?.name) return <Navigate to="/student/join" replace />

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0e2a 0%, #1a1040 50%, #0d1b3e 100%)' }}
    >
      {/* Orbs */}
      <Orb className="w-96 h-96 bg-violet-600 -top-32 -left-32" />
      <Orb className="w-80 h-80 bg-indigo-500 -bottom-20 -right-20" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">QuizRoom</span>
        </div>

        {/* PIN chips */}
        <div className="flex items-center gap-1.5">
          <Hash size={12} className="text-white/40" />
          {state.pin.split('').map((d, i) => (
            <span key={i} className="w-6 h-7 flex items-center justify-center rounded-md bg-white/10 text-white text-sm font-bold">
              {d}
            </span>
          ))}
        </div>
      </header>

      {/* Quiz title + waiting indicator */}
      <div className="relative z-10 flex flex-col items-center pt-8 pb-4 px-4 text-center">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Waiting Room</p>
        <h1 className="text-2xl font-extrabold text-white mb-4">{state.quizTitle}</h1>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
          <p className="text-sm text-white/50">Waiting for teacher to start…</p>
        </div>
      </div>

      {/* Player count badge */}
      <div className="relative z-10 flex justify-center mb-4">
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
          <Users size={13} className="text-violet-300" />
          <span className="text-sm font-bold text-white">{participants.length}</span>
          <span className="text-xs text-white/50">{participants.length === 1 ? 'player' : 'players'} joined</span>
        </div>
      </div>

      {/* ── Participant grid ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-8">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Users size={28} className="text-white/20" />
            </div>
            <p className="text-sm text-white/30">No players yet — share the PIN!</p>
          </div>
        ) : (
          <div className="grid gap-y-6 gap-x-4 justify-items-center"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
            {participants.map((name, i) => (
              <PlayerCard
                key={name + i}
                name={name}
                isMe={name === state.name}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom status */}
      <div className="relative z-10 flex justify-center pb-6">
        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full
          ${connStatus === 'connected'
            ? 'text-green-400 bg-green-400/10'
            : connStatus === 'disconnected' || connStatus === 'error'
              ? 'text-red-400 bg-red-400/10'
              : 'text-yellow-400 bg-yellow-400/10'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            connStatus === 'connected' ? 'bg-green-400' :
            connStatus === 'disconnected' || connStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
          }`} />
          {connStatus === 'connected' ? 'Connected' : connStatus === 'disconnected' ? 'Disconnected' : connStatus === 'error' ? 'Connection error' : 'Connecting…'}
        </div>
      </div>
    </div>
  )
}
