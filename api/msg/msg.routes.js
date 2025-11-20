import express from 'express'
import { getMsgs, getMsgById, saveMsg, removeMsg } from './msg.controller.js'
import { log } from '../../middleware/log.middleware.js'
import { requireAuth } from '../../middleware/require-auth.middleware.js'

const router = express.Router()

router.post('/', log, requireAuth, saveMsg)
router.put('/', log, requireAuth, saveMsg)
router.get('/:msgId', log, getMsgById)
router.get('/', log, getMsgs)
router.delete('/:msgId', log, requireAuth, removeMsg)

export const msgRouter = router
