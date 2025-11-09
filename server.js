import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import PDFDocument from 'pdfkit'

import { bugService } from './api/bug/bug.service.js'
import { bugRouter } from './api/bug/bug.routes.js'
import { userRouter } from './api/user/user.routes.js'


// import { loggerService } from './services/logger.service.js'˚


const app = express()

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

app.use('/api/bug', bugRouter)
app.use('/api/user', userRouter)


app.listen(3030, () => console.log('Server ready at port 3030'))