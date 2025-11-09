import express from 'express'
import { getUsers, getUserById, saveUser, removeUser } from './user.controller.js'

const router = express.Router()

router.post('/', saveUser)
router.put('/', saveUser)
router.get('/:userId', getUserById)
router.get('/:params', getUsers)
router.get('/', getUsers)
router.delete('/:userId', removeUser)


export const userRouter = router