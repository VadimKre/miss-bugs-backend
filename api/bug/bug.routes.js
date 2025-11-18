import express from 'express'
import { getBugs, saveBug, getBugById, getPDF, removeBug } from './bug.controller.js'
import { log } from '../../middleware/log.middleware.js'
import { requireAuth } from '../../middleware/require-auth.middleware.js'

const router = express.Router()

router.post('/',log ,requireAuth ,saveBug)
router.put('/',log,requireAuth, saveBug)
router.get('/:bugId',log, getBugById)
router.get('/:params', log, getBugs)
router.get('/', log, getBugs)
router.get('/:bugId/pdf', log, getPDF)
router.delete('/:bugId', log, requireAuth, removeBug)


export const bugRouter = router