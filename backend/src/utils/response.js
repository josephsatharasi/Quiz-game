export function successResponse(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({ success: true, ...data })
}

export function errorResponse(res, message = 'Internal server error', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message })
}
