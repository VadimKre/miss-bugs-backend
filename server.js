import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import PDFDocument from 'pdfkit'
import path from 'path'
import { fileURLToPath } from 'url'

import { bugService } from './api/bug/bug.service.js'
import { bugRouter } from './api/bug/bug.routes.js'
import { userRouter } from './api/user/user.routes.js'
import { authRouter } from './api/auth/auth.routes.js'
import { msgRouter } from './api/msg/msg.routes.js'


import { loggerService } from './services/logger.service.js'
import { dbService } from './services/db.service.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicPath = path.resolve(__dirname, 'public')

const corsOptions = {
    origin: [
        'http://127.0.0.1:3030',
        'http://localhost:3030',
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')
app.use(express.static(publicPath))

app.use('/api/bug', bugRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/msg', msgRouter)

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(3030, () => console.log('Server ready at port 3030'))
