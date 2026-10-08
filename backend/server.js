import express        from 'express'
import http           from 'http'
import cors           from 'cors'
import mongoose       from 'mongoose'
import { Server }     from 'socket.io'

import { config }                 from './src/config/env.js'
import { corsOptions }            from './src/config/cors.js'
import { requestLogger }          from './src/middleware/requestLogger.js'
import { notFoundHandler }        from './src/middleware/notFound.js'
import { errorHandler }           from './src/middleware/errorHandler.js'
import { registerSocketHandlers } from './src/sockets/index.js'
import { logger }                 from './src/utils/logger.js'

import healthRoutes  from './src/routes/healthRoutes.js'
import authRoutes    from './src/routes/authRoutes.js'
import quizRoutes    from './src/routes/quizRoutes.js'
import sessionRoutes from './src/routes/sessionRoutes.js'

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, { cors: corsOptions })

app.use(cors(corsOptions))
app.use(express.json())
app.use(requestLogger)

app.use('/api',          healthRoutes)
app.use('/api/auth',     authRoutes)
app.use('/api/quizzes',  quizRoutes)
app.use('/api/sessions', sessionRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

registerSocketHandlers(io)

mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('MongoDB connected')
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`)
    })
  })
  .catch((err) => {
    logger.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
