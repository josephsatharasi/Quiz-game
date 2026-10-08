import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react'

const STATUS_CONFIG = {
  connected: {
    icon: Wifi,
    label: 'Connected',
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
  },
  waiting: {
    icon: CheckCircle2,
    label: 'Connected',
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
  },
  reconnecting: {
    icon: RefreshCw,
    label: 'Reconnecting…',
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    spin: true,
  },
  disconnected: {
    icon: WifiOff,
    label: 'Disconnected',
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
  },
}

export default function ConnectionStatus({ status = 'connected' }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.connected
  const Icon = cfg.icon

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${status === 'reconnecting' ? 'animate-pulse' : ''}`} />
      <Icon size={13} className={cfg.spin ? 'animate-spin' : ''} />
      {cfg.label}
    </div>
  )
}
