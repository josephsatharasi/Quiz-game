import { config } from './env.js'

export const corsOptions = {
  // In production (classroom LAN) allow all origins so any device on the network can connect.
  // Tighten this once a fixed IP is known.
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://quiz-game-teacher.onrender.com',
    'https://quiz-game-students.onrender.com',
    /^http:\/\/192\.168\.\d+\.\d+/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
