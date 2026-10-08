import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { errorResponse } from '../utils/response.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return errorResponse(res, 'Unauthorized', 401)
  try {
    req.teacher = jwt.verify(header.slice(7), config.jwtSecret)
    next()
  } catch {
    errorResponse(res, 'Invalid or expired token', 401)
  }
}
