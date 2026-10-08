import { createBrowserRouter, Navigate } from 'react-router-dom'

import TrainerLayout  from '../components/layout/TrainerLayout'
import LoginPage      from '../features/trainer/pages/LoginPage'
import DashboardPage  from '../features/trainer/pages/DashboardPage'
import LiveQuizPage   from '../features/trainer/pages/LiveQuizPage'
import CreateQuizPage from '../features/trainer/pages/CreateQuizPage'
import MyQuizzesPage  from '../features/trainer/pages/MyQuizzesPage'
import ResultsPage    from '../features/trainer/pages/ResultsPage'
import { useAuth }    from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { teacher, loading } = useAuth()
  if (loading) return null
  if (!teacher) return <Navigate to="/login" replace />
  return children
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><TrainerLayout /></ProtectedRoute>,
    children: [
      { index: true,              element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard',        element: <DashboardPage /> },
      { path: 'quizzes',          element: <MyQuizzesPage /> },
      { path: 'create',           element: <CreateQuizPage /> },
      { path: 'quizzes/:id/edit', element: <CreateQuizPage /> },
      { path: 'results',          element: <ResultsPage /> },
    ],
  },
  {
    path: '/quiz/:id/live',
    element: <ProtectedRoute><LiveQuizPage /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])

export default router
