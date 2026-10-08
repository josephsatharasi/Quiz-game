import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import Card   from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input  from '../../../components/ui/Input'
import { api } from '../../../lib/api'
import { useAuth } from '../../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [tab,     setTab]     = useState('login')   // 'login' | 'register'
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register'
      const body     = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const data = await api.post(endpoint, body)
      login(data.token, data.teacher)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 animate-slide-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center mb-3">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">QuizRoom</h1>
          <p className="text-sm text-slate-400 mt-1">Teacher Portal</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize
                ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <Input label="Name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
          )}
          <Input label="Email" name="email" type="email" placeholder="teacher@school.com" value={form.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full mt-1" loading={loading}>
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
