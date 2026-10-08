import { successResponse } from '../utils/response.js'
import { config } from '../config/env.js'

export function healthCheck(req, res) {
  successResponse(res, {
    message:     'Quiz server is running',
    environment: config.nodeEnv,
    uptime:      `${Math.floor(process.uptime())}s`,
    timestamp:   new Date().toISOString(),
  })
}
