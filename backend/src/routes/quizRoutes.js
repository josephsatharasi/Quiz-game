import { Router } from 'express'
import { getQuizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz } from '../controllers/quizController.js'
import { requireAuth } from '../middleware/auth.js'
import { createSession } from '../controllers/sessionController.js'

const router = Router()

router.use(requireAuth)

router.get('/',                    getQuizzes)
router.get('/:id',                 getQuiz)
router.post('/',                   createQuiz)
router.put('/:id',                 updateQuiz)
router.delete('/:id',              deleteQuiz)
router.post('/:quizId/session',    createSession)

export default router
