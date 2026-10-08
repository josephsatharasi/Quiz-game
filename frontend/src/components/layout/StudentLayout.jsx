import { Outlet, useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function StudentLayout() {
  const { pathname } = useLocation()
  const isFullScreen = pathname === '/student/join' || pathname === '/student' || pathname === '/student/waiting'

  // These pages handle their own full-screen layout
  if (isFullScreen) return <Outlet />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex flex-col">
      <header className="px-4 py-4 flex items-center gap-2 border-b border-slate-100 bg-white/70 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
          <GraduationCap size={18} className="text-white" />
        </div>
        <span className="font-semibold text-slate-800 text-sm">QuizRoom</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
