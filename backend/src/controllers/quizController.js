import Quiz from '../models/Quiz.js'
import { successResponse, errorResponse } from '../utils/response.js'

export async function getQuizzes(req, res) {
  try {
    const quizzes = await Quiz.find({ teacher: req.teacher.id }).sort({ createdAt: -1 })
    .select('-questions').lean()
  // attach question count
  const withCount = await Promise.all(quizzes.map(async (q) => {
    const count = await Quiz.findById(q._id).select('questions').lean()
    return { ...q, questionCount: count?.questions?.length ?? 0 }
  }))
    successResponse(res, { quizzes: withCount })
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function getQuiz(req, res) {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, teacher: req.teacher.id })
    if (!quiz) return errorResponse(res, 'Quiz not found', 404)
    successResponse(res, { quiz })
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function createQuiz(req, res) {
  try {
    const { title, subject, timePerQuestion, questions } = req.body
    if (!title || !subject) return errorResponse(res, 'Title and subject are required', 400)
    const quiz = await Quiz.create({
      teacher: req.teacher.id,
      title,
      subject,
      timePerQuestion: timePerQuestion || 20,
      questions: questions || [],
      status: questions?.length > 0 ? 'ready' : 'draft',
    })
    successResponse(res, { quiz }, 201)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function updateQuiz(req, res) {
  try {
    const { title, subject, timePerQuestion, questions, status } = req.body
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, teacher: req.teacher.id },
      { title, subject, timePerQuestion, questions, status },
      { new: true, runValidators: true }
    )
    if (!quiz) return errorResponse(res, 'Quiz not found', 404)
    successResponse(res, { quiz })
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function deleteQuiz(req, res) {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, teacher: req.teacher.id })
    if (!quiz) return errorResponse(res, 'Quiz not found', 404)
    successResponse(res, { message: 'Quiz deleted' })
  } catch (err) {
    errorResponse(res, err.message)
  }
}
