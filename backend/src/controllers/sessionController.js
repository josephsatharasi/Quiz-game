import Session from '../models/Session.js'
import Quiz from '../models/Quiz.js'
import { successResponse, errorResponse } from '../utils/response.js'

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function createSession(req, res) {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.quizId, teacher: req.teacher.id })
    if (!quiz) return errorResponse(res, 'Quiz not found', 404)
    if (quiz.questions.length === 0) return errorResponse(res, 'Quiz has no questions', 400)

    // End any existing live session for this quiz
    await Session.updateMany({ quiz: quiz._id, status: { $ne: 'ended' } }, { status: 'ended' })

    let pin, exists
    do { pin = generatePin(); exists = await Session.findOne({ pin }) } while (exists)

    const session = await Session.create({ quiz: quiz._id, teacher: req.teacher.id, pin })
    await Quiz.findByIdAndUpdate(quiz._id, { status: 'live' })

    successResponse(res, { session }, 201)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function getSessionByPin(req, res) {
  try {
    const session = await Session.findOne({ pin: req.params.pin, status: { $ne: 'ended' } })
      .populate('quiz', 'title subject timePerQuestion questions')
    if (!session) return errorResponse(res, 'Invalid or expired PIN', 404)
    // Don't expose correct answers to students
    const safeQuestions = session.quiz.questions.map(({ text, code, options }) => ({ text, code, options }))
    successResponse(res, {
      sessionId: session._id,
      pin: session.pin,
      quizTitle: session.quiz.title,
      subject: session.quiz.subject,
      timePerQuestion: session.quiz.timePerQuestion,
      totalQuestions: session.quiz.questions.length,
      status: session.status,
      questions: safeQuestions,
    })
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function getEndedSessions(req, res) {
  try {
    const sessions = await Session.find({ teacher: req.teacher.id, status: 'ended' })
      .populate('quiz', 'title subject')
      .sort({ updatedAt: -1 })
      .lean()

    const results = sessions.map((s) => {
      const participants = s.participants ?? []
      const scores = participants.map((p) => p.score)
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const topScore = scores.length ? Math.max(...scores) : 0
      const topStudents = [...participants]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((p) => ({ name: p.name, score: p.score }))
      return {
        _id:          s._id,
        quizTitle:    s.quiz?.title ?? 'Unknown',
        subject:      s.quiz?.subject ?? '',
        conductedOn:  new Date(s.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        participants: participants.length,
        avgScore,
        topScore,
        topStudents,
      }
    })
    successResponse(res, { results })
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export async function getSessionStats(req, res) {
  try {
    const session = await Session.findOne({ _id: req.params.id, teacher: req.teacher.id })
    if (!session) return errorResponse(res, 'Session not found', 404)
    successResponse(res, { session })
  } catch (err) {
    errorResponse(res, err.message)
  }
}
