
import { authService } from "./auth.service.js"

export async function login(req, res){
    const credentials = req.body
    try{
        const miniUser = await authService.login(credentials)
        if (!miniUser) throw 'login failed'
        const loginToken = authService.getLoginToken(miniUser)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.status(200).send(miniUser)
    } catch(e){
        console.log('Error in controller - login', e)
        res.status(401).send({ err: 'Failed to Login' })
    }
}
export async function signup(req, res){
    const user = req.body
    try{
        const userToSignUp = await authService.signup(user)
        res.status(200).send(`User ${user.username} signed up`)
    } catch(e){
        console.log('Error in controller - signup', e)
        res.status(400).send({ err: 'Failed to SignUp' })
    }
}
export async function logout(req, res){
    
    try{
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch(e){
        console.log('Error in controller - signup', e)
        res.status(400).send({ err: 'Failed to logout' })
    }
}