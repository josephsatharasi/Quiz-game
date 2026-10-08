import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, trend, up, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4 hover:border-slate-200 transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-primary-600" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
            ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}
          >
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}
