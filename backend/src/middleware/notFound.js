import { errorResponse } from '../utils/response.js'

export function notFoundHandler(req, res) {
  errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404)
}
