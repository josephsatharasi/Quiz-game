import StudentAvatar from './StudentAvatar'

export default function ParticipantGrid({ participants = [], currentName = '' }) {
  if (!participants.length) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {participants.map((p) => (
        <div
          key={p.id}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-300 animate-slide-up
            ${p.name === currentName
              ? 'bg-primary-50 border-primary-200'
              : 'bg-slate-50 border-slate-100'
            }`}
        >
          <StudentAvatar name={p.name} size="sm" />
          <span className={`text-xs font-medium truncate ${p.name === currentName ? 'text-primary-700' : 'text-slate-700'}`}>
            {p.name}
            {p.name === currentName && (
              <span className="ml-1 text-primary-400 font-normal">(you)</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
