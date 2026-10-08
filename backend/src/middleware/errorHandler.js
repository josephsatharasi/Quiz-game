import { logger } from '../utils/logger.js'
import { errorResponse } from '../utils/response.js'

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error(err.message, err.stack)
  const status  = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'
  errorResponse(res, message, status)
}
