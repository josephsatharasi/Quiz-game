import { HelpCircle } from 'lucide-react'

const DEFAULT_STEPS = [
  'Enter the PIN shown by your trainer',
  'Enter your name',
  'Tap Join Quiz',
  'Wait for the trainer to start',
]

export default function HowToJoin({ steps = DEFAULT_STEPS }) {
  return (
    <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={15} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">How to Join</span>
      </div>
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-slate-600">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
