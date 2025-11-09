
import { userService } from './user.service.js'

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
        if (userToSave) {
            const user = await userService.save(userToSave)
            res.send(user)
        }
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
        const { userId } = req.params
        await userService.remove(userId) 
        res.send(`Removed ID ${userId} succsesfully`)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Couldn't remove user`)
    }
}
