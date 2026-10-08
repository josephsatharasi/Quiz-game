import { Router } from 'express'
import { getSessionByPin, getSessionStats, getEndedSessions } from '../controllers/sessionController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/pin/:pin', getSessionByPin)
router.get('/',         requireAuth, getEndedSessions)
router.get('/:id',      requireAuth, getSessionStats)

export default router
