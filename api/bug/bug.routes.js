import express from 'express'
import { getBugs, saveBug, getBugById, getPDF, removeBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:params', getBugs)
router.post('/', saveBug)
router.put('/', saveBug)
router.get('/:bugId', getBugById)
router.get('/:bugId/pdf', getPDF)
router.delete('/:bugId', removeBug)


export const bugRouter = router