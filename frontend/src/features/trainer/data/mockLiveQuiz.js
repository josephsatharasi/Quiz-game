// Socket.IO migration map:
// MOCK_SESSION        → socket.on('session:state', ...)
// MOCK_DISTRIBUTION   → socket.on('answer:distribution', ...)
// MOCK_LIVE_LEADERBOARD → socket.on('leaderboard:update', ...)

import { MOCK_QUESTIONS, MOCK_QUIZ } from '../../student/data/quizMockData'

export { MOCK_QUESTIONS, MOCK_QUIZ }

export const MOCK_SESSION = {
  pin:              '482913',
  participantCount: 28,
  answeredCount:    22,
  quizTitle:        'JavaScript Operators',
  totalQuestions:   20,
}

// Answer distribution per question index
export function getMockDistribution(questionIndex, totalStudents) {
  const seeds = [
    [4, 18, 2, 4],
    [12, 10, 3, 3],
    [2, 5, 19, 2],
    [3, 17, 4, 4],
    [2, 20, 3, 3],
  ]
  const counts = seeds[questionIndex % seeds.length]
  const total  = counts.reduce((a, b) => a + b, 0)
  return ['a', 'b', 'c', 'd'].map((id, i) => ({
    id,
    label:   ['A', 'B', 'C', 'D'][i],
    count:   counts[i],
    percent: Math.round((counts[i] / total) * 100),
  }))
}

export const MOCK_LIVE_LEADERBOARD = [
  { id: 1, rank: 1, name: 'Rahul Sharma',     score: 4850, rankChange:  2 },
  { id: 2, rank: 2, name: 'Joseph Satharasi', score: 4700, rankChange: -1 },
  { id: 3, rank: 3, name: 'Anjali Mehta',     score: 4550, rankChange:  0 },
  { id: 4, rank: 4, name: 'Priya Nair',       score: 4200, rankChange:  1 },
  { id: 5, rank: 5, name: 'Kiran Patel',      score: 4050, rankChange: -2 },
]
