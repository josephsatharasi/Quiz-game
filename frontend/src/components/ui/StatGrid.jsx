export default function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, sub, icon: Icon, accent }, i) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-slate-100 px-4 py-4 flex flex-col gap-2 animate-slide-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ?? 'bg-primary-50'}`}>
            <Icon size={16} className={`${accent ? 'text-white' : 'text-primary-600'}`} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
