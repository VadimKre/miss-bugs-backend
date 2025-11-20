import { authService } from "../api/auth/auth.service.js"

export function requireAuth(req, res, next){
    const loginToken = req.cookies.loginToken
    const user = authService.validateToken(loginToken)
    if (!user) res.status(401).send('required authentication')
    const isAdmin = user?.isAdmin

    req.user = user 
    req.isAdmin = isAdmin
    next()
}