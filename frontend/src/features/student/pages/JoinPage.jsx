import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap, ArrowRight, GraduationCap, AlertTriangle } from 'lucide-react'
import { api } from '../../../lib/api'

// ── Animated PIN input ────────────────────────────────────────────────────────
function PinBox({ value, onChange, error }) {
  const inputs = useRef([])
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '')

  function handleChange(e, i) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]; next[i] = char; onChange(next)
    if (char) inputs.current[i + 1]?.focus()
  }
  function handleKeyDown(e, i) {
    if (e.key === 'Backspace' && !digits[i]) inputs.current[i - 1]?.focus()
  }
  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '')
    onChange(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2.5 justify-center">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all duration-200 bg-white/5 backdrop-blur-sm
              ${error
                ? 'border-red-400 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.3)]'
                : d
                  ? 'border-primary-400 text-white shadow-[0_0_16px_rgba(139,92,246,0.5)] bg-primary-500/20'
                  : 'border-white/20 text-white focus:border-primary-400 focus:shadow-[0_0_16px_rgba(139,92,246,0.4)] focus:bg-white/10'
              }`}
          />
        ))}
      </div>
      {error && (
        <p className="text-center text-xs text-red-400 font-medium">{error}</p>
      )}
    </div>
  )
}

// ── Floating orb decoration ───────────────────────────────────────────────────
function Orb({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />
}

export default function JoinPage() {
  const navigate            = useNavigate()
  const { state: locState } = useLocation()
  const wasKicked           = locState?.kicked === true
  const [pin,     setPin]     = useState(Array(6).fill(''))
  const [name,    setName]    = useState('')
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  function validate() {
    const errs = {}
    if (pin.join('').length !== 6) errs.pin  = 'PIN must be exactly 6 digits'
    if (!name.trim())               errs.name = 'Please enter your name'
    return errs
  }

  async function handleJoin() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const pinStr = pin.join('')
      const data   = await api.get(`/sessions/pin/${pinStr}`)
      navigate('/student/waiting', {
        state: {
          pin:             pinStr,
          name:            name.trim(),
          sessionId:       data.sessionId,
          quizTitle:       data.quizTitle,
          subject:         data.subject,
          totalQuestions:  data.totalQuestions,
          timePerQuestion: data.timePerQuestion,
          questions:       data.questions,
        },
      })
    } catch (e) {
      setErrors({ pin: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0f0e2a 0%, #1a1040 50%, #0d1b3e 100%)' }}>

      {/* Decorative orbs */}
      <Orb className="w-96 h-96 bg-primary-500 -top-32 -left-32" />
      <Orb className="w-80 h-80 bg-indigo-500 -bottom-20 -right-20" />
      <Orb className="w-64 h-64 bg-violet-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Kicked banner */}
      {wasKicked && (
        <div className="relative z-10 w-full max-w-sm mb-4 animate-slide-up flex items-center gap-3 bg-red-500/15 border border-red-500/30 rounded-2xl px-4 py-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300 font-medium">You were removed from the room by the teacher.</p>
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10 animate-slide-up">
        <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/50">
          <GraduationCap size={20} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">QuizRoom</span>
      </div>

      {/* Main card */}
      <div className="w-full max-w-sm animate-slide-up"
        style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>

        {/* Hero text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-1.5 mb-4">
            <Zap size={13} className="text-primary-400" />
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-widest">Live Quiz</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
            Join the<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #a78bfa, #818cf8)' }}>
              Quiz Room
            </span>
          </h1>
          <p className="text-sm text-white/40">Enter the PIN your teacher shared on screen</p>
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-white/10 p-6 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}>

          {/* PIN */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest text-center mb-3">
              Quiz PIN
            </p>
            <PinBox value={pin} onChange={setPin} error={errors.pin} />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-medium">then</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Name input */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Your Name</p>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium outline-none transition-all duration-200 bg-white/5 text-white placeholder-white/25
                ${errors.name
                  ? 'border-red-400/60 shadow-[0_0_12px_rgba(248,113,113,0.2)]'
                  : focused
                    ? 'border-primary-400/60 shadow-[0_0_16px_rgba(139,92,246,0.25)]'
                    : 'border-white/15 hover:border-white/25'
                }`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.name}</p>}
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{ background: loading ? 'rgba(124,58,237,0.6)' : 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 4px 24px rgba(124,58,237,0.4)' }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Joining…
              </>
            ) : (
              <>
                Join Quiz
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Steps */}
        <div className="mt-6 flex items-center justify-center gap-6">
          {['Enter PIN', 'Your Name', 'Join!'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary-500/30 border border-primary-500/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary-300">{i + 1}</span>
              </div>
              <span className="text-xs text-white/30 font-medium">{step}</span>
              {i < 2 && <div className="w-4 h-px bg-white/10" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
