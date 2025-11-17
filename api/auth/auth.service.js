import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}

function getLoginToken(user){
    const str = JSON.stringify(user)
    const hashedStr = cryptr.encrypt(str)
    return hashedStr
}

function validateToken(token){

    try{
        if(!token) return null
        const str = cryptr.decrypt(token)
        const user = JSON.parse(str)
        return user
    } catch(e){
        console.log('Invalid user login token')
        throw e
    }
    
}

async function signup({ username, password, fullname }){
    const saltRounds = 10
    try{
        if (!username || !password || !fullname) throw 'Missing signup information'
        if (userService.getByUsername(username)) throw 'Username already exists' 
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return userService.create({ username, password: hashedPassword, fullname })
    } catch(e){
        console.log('Error in signup user')
        throw e
    }
}

async function login({ username, password }){

    try{
        if (!username || !password) throw 'Missing login information'

        const user = userService.getByUsername(username)
        if (!user) throw 'No such user'

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw 'Wrong password'

        return {
            _id: user._id,
            username,
            fullname: user.fullname,
            score: user.score,
            isAdmin: user.isAdmin
        }
    } catch(e){
        console.log('Error in login user')
        throw e
    }
}
