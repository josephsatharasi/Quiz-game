// Replace with API calls later

export const MOCK_STATS = [
  { id: 'quizzes',    label: 'Total Quizzes',      value: '12',   trend: '+2 this month',  up: true  },
  { id: 'students',   label: 'Total Students',     value: '284',  trend: '+18 this week',  up: true  },
  { id: 'conducted',  label: 'Quizzes Conducted',  value: '38',   trend: '+5 this month',  up: true  },
  { id: 'avgscore',   label: 'Avg. Class Score',   value: '74%',  trend: '-2% vs last',    up: false },
]

export const MOCK_QUIZZES = [
  {
    id: 1,
    title:       'JavaScript Operators',
    subject:     'JavaScript',
    questions:   20,
    duration:    '10 min',
    lastUsed:    '2 days ago',
    students:    28,
    avgScore:    '78%',
    status:      'ready',   // ready | live | draft
  },
  {
    id: 2,
    title:       'Java Loops & Iteration',
    subject:     'Java',
    questions:   15,
    duration:    '8 min',
    lastUsed:    '1 week ago',
    students:    34,
    avgScore:    '71%',
    status:      'ready',
  },
  {
    id: 3,
    title:       'C Programming Basics',
    subject:     'C',
    questions:   25,
    duration:    '12 min',
    lastUsed:    '3 days ago',
    students:    22,
    avgScore:    '65%',
    status:      'draft',
  },
  {
    id: 4,
    title:       'Python Data Structures',
    subject:     'Python',
    questions:   18,
    duration:    '9 min',
    lastUsed:    'Yesterday',
    students:    41,
    avgScore:    '82%',
    status:      'ready',
  },
  {
    id: 5,
    title:       'HTML & CSS Fundamentals',
    subject:     'Web',
    questions:   12,
    duration:    '6 min',
    lastUsed:    '5 days ago',
    students:    19,
    avgScore:    '88%',
    status:      'ready',
  },
]
