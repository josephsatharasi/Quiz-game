import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const config = {
  success: { icon: CheckCircle, classes: 'bg-green-50 border-green-200 text-green-800' },
  error:   { icon: XCircle,     classes: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertCircle, classes: 'bg-amber-50 border-amber-200 text-amber-800' },
  info:    { icon: Info,        classes: 'bg-blue-50 border-blue-200 text-blue-800' },
}

export default function Toast({ message, type = 'info', onClose }) {
  const { icon: Icon, classes } = config[type] ?? config.info
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-sm animate-slide-up ${classes}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
