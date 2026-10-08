import { useRef } from 'react'

export default function PinInput({ value = [], onChange, error }) {
  const inputs = useRef([])
  const LENGTH = 6

  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? '')

  function focusNext(index) {
    inputs.current[index + 1]?.focus()
  }

  function focusPrev(index) {
    inputs.current[index - 1]?.focus()
  }

  function handleChange(e, index) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    onChange(next)
    if (char) focusNext(index)
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace' && !digits[index]) focusPrev(index)
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    const next = Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? '')
    onChange(next)
    const focusIndex = Math.min(pasted.length, LENGTH - 1)
    inputs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">Quiz PIN</label>
      <div className="flex gap-2 justify-between">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className={`w-full aspect-square max-w-[52px] text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150
              ${error
                ? 'border-red-400 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : digit
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
              }`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
