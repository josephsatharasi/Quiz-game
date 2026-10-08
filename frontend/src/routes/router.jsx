import { createBrowserRouter, Navigate } from 'react-router-dom'

import StudentLayout  from '../components/layout/StudentLayout'
import JoinPage       from '../features/student/pages/JoinPage'
import WaitingPage    from '../features/student/pages/WaitingPage'
import QuizPage       from '../features/student/pages/QuizPage'
import LeaderboardPage from '../features/student/pages/LeaderboardPage'
import ResultPage     from '../features/student/pages/ResultPage'

const router = createBrowserRouter([
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { index: true,         element: <Navigate to="join" replace /> },
      { path: 'join',        element: <JoinPage /> },
      { path: 'waiting',     element: <WaitingPage /> },
      { path: 'quiz',        element: <QuizPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'result',      element: <ResultPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/student/join" replace />,
  },
])

export default router
