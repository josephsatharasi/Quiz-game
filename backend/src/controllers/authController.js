import jwt from 'jsonwebtoken'
import Teacher from '../models/Teacher.js'
import { config } from '../config/env.js'
import { successResponse, errorResponse } from '../utils/response.js'

function signToken(teacher) {
  return jwt.sign({ id: teacher._id, email: teacher.email }, config.jwtSecret, { expiresIn: '7d' })
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return errorResponse(res, 'All fields are required', 400)
    if (await Teacher.findOne({ email })) return errorResponse(res, 'Email already registered', 409)
    const teacher = await Teacher.create({ name, email, password })
    successResponse(res, { token: signToken(teacher), teacher: teacher.toSafeObject() }, 201)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return errorResponse(res, 'Email and password are required', 400)
    const teacher = await Teacher.findOne({ email })
    if (!teacher || !(await teacher.comparePassword(password))) return errorResponse(res, 'Invalid credentials', 401)
    successResponse(res, { token: signToken(teacher), teacher: teacher.toSafeObject() })
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function getMe(req, res) {
  try {
    const teacher = await Teacher.findById(req.teacher.id).select('-password')
    if (!teacher) return errorResponse(res, 'Teacher not found', 404)
    successResponse(res, { teacher })
  } catch (err) {
    errorResponse(res, err.message)
  }
}
