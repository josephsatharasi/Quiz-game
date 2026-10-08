import { ShieldCheck } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 animate-slide-up">
        <div className="flex flex-col items-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center mb-3">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Trainer Login</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage your quizzes</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="trainer@school.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Button className="w-full mt-1">Sign In</Button>
        </div>
      </Card>
    </div>
  )
}
