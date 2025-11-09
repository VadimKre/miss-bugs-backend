import express from 'express'
import { getBugs, saveBug, getBugById, getPDF, removeBug } from './bug.controller.js'

const router = express.Router()

router.post('/', saveBug)
router.put('/', saveBug)
router.get('/:bugId', getBugById)
router.get('/:params', getBugs)
router.get('/', getBugs)
router.get('/:bugId/pdf', getPDF)
router.delete('/:bugId', removeBug)


export const bugRouter = router