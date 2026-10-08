export default function Loading({ text = 'Loading…', fullScreen = false }) {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      <span className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
  if (fullScreen) return <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80">{inner}</div>
  return <div className="flex items-center justify-center py-12">{inner}</div>
}
