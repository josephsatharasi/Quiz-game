import Session from '../models/Session.js'
import Quiz    from '../models/Quiz.js'
import { logger } from '../utils/logger.js'

// roomId = session._id.toString()

function getLeaderboard(participants) {
  return [...participants]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((p, i) => ({ name: p.name, score: p.score, rank: i + 1 }))
}

function getDistribution(participants, questionIndex) {
  const counts = { a: 0, b: 0, c: 0, d: 0 }
  for (const p of participants) {
    const ans = p.answers?.get?.(String(questionIndex))
    if (ans && counts[ans] !== undefined) counts[ans]++
  }
  const total = Object.values(counts).reduce((s, v) => s + v, 0)
  return ['a', 'b', 'c', 'd'].map((id, i) => ({
    id,
    label:   ['A', 'B', 'C', 'D'][i],
    count:   counts[id],
    percent: total ? Math.round((counts[id] / total) * 100) : 0,
  }))
}

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`)

    // ── Teacher joins session room ──────────────────────────────────────────
    socket.on('teacher:join', async ({ sessionId }) => {
      try {
        const session = await Session.findById(sessionId).populate('quiz')
        if (!session) return socket.emit('error', { message: 'Session not found' })
        socket.join(sessionId)
        socket.data.role      = 'teacher'
        socket.data.sessionId = sessionId
        socket.emit('session:state', {
          pin:             session.pin,
          status:          session.status,
          phase:           session.phase,
          currentQuestion: session.currentQuestion,
          participants:    session.participants.length,
          quiz: {
            title:           session.quiz.title,
            totalQuestions:  session.quiz.questions.length,
            timePerQuestion: session.quiz.timePerQuestion,
            questions:       session.quiz.questions,
          },
        })
        // Send current participant list immediately in case students already joined
        const names = session.participants.map((p) => p.name)
        socket.emit('participants:update', { count: names.length, names })
        logger.info(`Teacher joined session ${sessionId}`)
      } catch (err) {
        logger.error(err.message)
      }
    })

    // ── Student joins session room ──────────────────────────────────────────
    socket.on('student:join', async ({ sessionId, name }) => {
      try {
        const session = await Session.findById(sessionId)
        if (!session || session.status === 'ended') return socket.emit('error', { message: 'Session not available' })

        // Add participant if not already present
        const exists = session.participants.find((p) => p.socketId === socket.id)
        if (!exists) {
          session.participants.push({ socketId: socket.id, name, score: 0, answers: {} })
          if (session.status === 'waiting') session.status = 'live'
          await session.save()
        }

        socket.join(sessionId)
        socket.data.role      = 'student'
        socket.data.sessionId = sessionId
        socket.data.name      = name

        socket.emit('student:joined', { name, phase: session.phase, currentQuestion: session.currentQuestion })

        // Notify everyone of updated participant list
        const names = session.participants.map((p) => p.name)
        io.to(sessionId).emit('participants:update', { count: names.length, names })
        logger.info(`Student "${name}" joined session ${sessionId}`)
      } catch (err) {
        logger.error(err.message)
      }
    })

    // ── Teacher kicks a student ────────────────────────────────────────────
    socket.on('teacher:kick', async ({ sessionId, name }) => {
      try {
        const session = await Session.findById(sessionId)
        if (!session) return
        const participant = session.participants.find((p) => p.name === name)
        if (!participant) return
        // Remove from DB
        session.participants = session.participants.filter((p) => p.name !== name)
        await session.save()
        // Tell the kicked student's socket
        if (participant.socketId) {
          io.to(participant.socketId).emit('kicked', { reason: 'Removed by teacher' })
          const kickedSocket = io.sockets.sockets.get(participant.socketId)
          if (kickedSocket) kickedSocket.leave(sessionId)
        }
        // Broadcast updated list to room
        const names = session.participants.map((p) => p.name)
        io.to(sessionId).emit('participants:update', { count: names.length, names })
        logger.info(`Teacher kicked "${name}" from session ${sessionId}`)
      } catch (err) {
        logger.error(err.message)
      }
    })

    // ── Teacher controls ────────────────────────────────────────────────────
    socket.on('teacher:action', async ({ action }) => {
      try {
        const { sessionId } = socket.data
        if (!sessionId) return

        const session = await Session.findById(sessionId).populate('quiz')
        if (!session) return

        const TRANSITIONS = {
          start:            'running',
          pause:            'paused',
          resume:           'running',
          show_answer:      'answer_shown',
          show_leaderboard: 'leaderboard_shown',
        }

        if (action === 'next') {
          const isLast = session.currentQuestion >= session.quiz.questions.length - 1
          if (isLast) {
            session.phase  = 'ended'
            session.status = 'ended'
            await session.save()
            await Quiz.findByIdAndUpdate(session.quiz._id, { status: 'ready' })
            io.to(sessionId).emit('quiz:ended', { leaderboard: getLeaderboard(session.participants) })
            return
          }
          session.currentQuestion += 1
          session.phase = 'idle'
          await session.save()
          io.to(sessionId).emit('question:next', {
            questionIndex: session.currentQuestion,
            answeredCount: 0,
          })
          return
        }

        if (action === 'end') {
          session.phase  = 'ended'
          session.status = 'ended'
          await session.save()
          await Quiz.findByIdAndUpdate(session.quiz._id, { status: 'ready' })
          io.to(sessionId).emit('quiz:ended', { leaderboard: getLeaderboard(session.participants) })
          return
        }

        const newPhase = TRANSITIONS[action]
        if (!newPhase) return

        session.phase = newPhase
        await session.save()

        const payload = { phase: newPhase, questionIndex: session.currentQuestion }

        if (newPhase === 'answer_shown') {
          payload.correctId    = session.quiz.questions[session.currentQuestion].correctId
          payload.distribution = getDistribution(session.participants, session.currentQuestion)
        }
        if (newPhase === 'leaderboard_shown') {
          payload.leaderboard  = getLeaderboard(session.participants)
          payload.distribution = getDistribution(session.participants, session.currentQuestion)
          payload.correctId    = session.quiz.questions[session.currentQuestion].correctId
        }

        io.to(sessionId).emit('phase:change', payload)
      } catch (err) {
        logger.error(err.message)
      }
    })

    // ── Student submits answer ──────────────────────────────────────────────
    socket.on('student:answer', async ({ sessionId, questionIndex, optionId, responseTime }) => {
      try {
        const session = await Session.findById(sessionId).populate('quiz')
        if (!session || session.phase !== 'running') return

        const question  = session.quiz.questions[questionIndex]
        const isCorrect = question.correctId === optionId
        const points    = isCorrect ? Math.max(500, Math.round(1000 - (responseTime / session.quiz.timePerQuestion) * 500)) : 0

        const participant = session.participants.find((p) => p.socketId === socket.id)
        if (!participant || participant.answers.get(String(questionIndex))) return  // already answered

        participant.answers.set(String(questionIndex), optionId)
        participant.score += points
        await session.save()

        const answeredCount = session.participants.filter((p) => p.answers.has(String(questionIndex))).length

        socket.emit('answer:result', { correct: isCorrect, pointsEarned: points, totalScore: participant.score, responseTime })
        io.to(sessionId).emit('answered:update', { answeredCount, total: session.participants.length })

        // Auto show answer when everyone has answered
        if (answeredCount === session.participants.length) {
          session.phase = 'answer_shown'
          await session.save()
          io.to(sessionId).emit('phase:change', {
            phase:        'answer_shown',
            questionIndex,
            correctId:    question.correctId,
            distribution: getDistribution(session.participants, questionIndex),
          })
        }
      } catch (err) {
        logger.error(err.message)
      }
    })

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      logger.info(`Socket disconnected: ${socket.id} — ${reason}`)
      try {
        const { sessionId, role } = socket.data
        if (!sessionId || role !== 'student') return
        const session = await Session.findById(sessionId)
        if (!session) return
        session.participants = session.participants.filter((p) => p.socketId !== socket.id)
        await session.save()
        const names = session.participants.map((p) => p.name)
        io.to(sessionId).emit('participants:update', { count: names.length, names })
      } catch (err) {
        logger.error(err.message)
      }
    })
  })
}
