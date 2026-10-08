import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, PlusCircle,
  BarChart2, Settings, LogOut, GraduationCap, Menu, X,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/trainer/dashboard', icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/trainer/quizzes',   icon: BookOpen,        label: 'My Quizzes'  },
  { to: '/trainer/create',    icon: PlusCircle,      label: 'Create Quiz' },
  { to: '/trainer/results',   icon: BarChart2,       label: 'Results'     },
  { to: '/trainer/settings',  icon: Settings,        label: 'Settings'    },
]

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150
        ${isActive
          ? 'bg-primary-600 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/10'
        }`
      }
    >
      <Icon size={17} />
      {label}
    </NavLink>
  )
}

function SidebarContent({ onNavClick, onLogout }) {
  return (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">QuizRoom</p>
          <p className="text-white/40 text-xs">Trainer Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavClick} />
        ))}
      </nav>

      {/* Trainer info + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            T
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Trainer</p>
            <p className="text-xs text-white/40 truncate">trainer@school.com</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  )
}

export default function TrainerLayout() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const [open, setOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleLogout() {
    setOpen(false)
    navigate('/trainer/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside
        className="hidden md:flex w-60 flex-col shrink-0 fixed inset-y-0 left-0 z-20"
        style={{ backgroundColor: '#0f0e2a' }}
      >
        <SidebarContent onNavClick={() => {}} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col md:hidden transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#0f0e2a' }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <SidebarContent onNavClick={() => setOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-60">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center">
              <GraduationCap size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">QuizRoom</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
