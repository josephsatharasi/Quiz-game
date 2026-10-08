import 'dotenv/config'

export const config = {
  port:      parseInt(process.env.PORT) || 5000,
  nodeEnv:   process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  isDev:     (process.env.NODE_ENV || 'development') === 'development',
  mongoUri:  process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
}
