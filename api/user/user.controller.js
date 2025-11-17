
import { userService } from './user.service.js'
import { authService } from '../auth/auth.service.js'

export async function getUserById(req, res) { 
    try{
        const { userId } = req.params
        const user = await userService.getById(userId)
        res.send(user)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`User not found`)
    }
}

export async function saveUser(req, res){
    try {
        const userToSave  = req.body
        if (!userToSave) return res.status(400).send(`Missing user payload`)

        const isAdmin = authService.validateToken(req.cookies.loginToken)?.isAdmin
        if (!isAdmin) return res.status(401).send('Not authorized')

        const user = userToSave._id ?
            await userService.update(userToSave) :
            await userService.create(userToSave)

        res.send(user)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Saving failed`)
    }
}

export async function getUsers(req, res){
    const { filterBy, sortBy, sortDir, pageIdx } = { ...req.query }
    try{

        const users = await userService.query(filterBy, sortBy, sortDir, pageIdx)
        res.send(users)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Users not found`)
    }
}

export async function removeUser(req, res){
    try{
        const isAdmin = authService.validateToken(req.cookies.loginToken)?.isAdmin

        const { userId } = req.params
        isAdmin ? await userService.remove(userId) : res.status(401).send('Not authorized') 
        res.send(`Removed ID ${userId} succsesfully`)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Couldn't remove user`)
    }
}
