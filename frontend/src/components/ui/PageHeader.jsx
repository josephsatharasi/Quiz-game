export default function PageHeader({ icon: Icon, iconBg = 'bg-primary-100', iconColor = 'text-primary-600', title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-3`}>
          <Icon size={24} className={iconColor} />
        </div>
      )}
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}
