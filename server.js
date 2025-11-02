import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import PDFDocument from 'pdfkit'

import { bugService } from './services/bug.service.js'

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

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bugs', async (req, res) => {
    const filterBy = { ...req.query }
    console.log('filterBy in server: ', filterBy)
    try{
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Bugs not found`)
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        const bugToSave = { ...req.query }
        if (bugToSave) {
            const bug = await bugService.save(bugToSave)
            res.send(bug)
        }
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Saving failed`)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    try{
        const { bugId } = req.params

        let visitedBugs = req.cookies.visitedBugs || []
        visitedBugs.findIndex( (id) => id === bugId) === -1 && (visitedBugs.push(bugId))
        console.log('visitedBugs: ', visitedBugs)

        if (visitedBugs.length > 3 ){ 
            res.status(401).send('Please wait')
        } else {
            res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })  
            const bug = await bugService.getById(bugId)
            res.send(bug)
        }

    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Bug not found`)
    }
})
app.get('/api/bug/:bugId/pdf', async (req, res) => {
    try{
        const { bugId } = req.params

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="bug-${bugId}.pdf`)
        const bug = await bugService.getById(bugId)

        const doc = new PDFDocument()
        doc.pipe(res)
        doc.text(
            `id: ${bug._id}\n
            Title: ${bug.title}\n
            Description: ${bug.description}\n
            Severity: ${bug.severity}
        `)
        doc.end()
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Cant create pdf`)
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    
    try{
        const { bugId } = req.params
        await bugService.remove(bugId) 
        res.send(`Removed ID ${bugId} succsesfully`)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Couldn't remove bug`)
    }
})

app.listen(3030, () => console.log('Server ready at port 3030'))