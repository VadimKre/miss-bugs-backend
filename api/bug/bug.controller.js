import PDFDocument from 'pdfkit'

import { bugService } from "./bug.service.js"
import { authService } from '../auth/auth.service.js'

export async function getBugById(req, res) { 
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
}


export async function saveBug(req, res){
    try {
        const loginToken = req.cookies.loginToken
        const user = authService.validateToken(loginToken)
        const bugToSave  = req.body
        if (bugToSave && user.username === bugToSave.creator.username) {
            const bug = await bugService.save(bugToSave, user)
            res.send(bug)
        } else throw 'Saving failed'
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Saving failed`)
    }
}


export async function getBugs(req, res){
    const { filterBy, sortBy, sortDir, pageIdx } = { ...req.query }
    try{
        const bugs = await bugService.query(filterBy, sortBy, sortDir, pageIdx)
        res.send(bugs)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Bugs not found`)
    }
}

export async function getPDF(req, res){
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
}

export async function removeBug(req, res){
    try{
        const { bugId } = req.params
        const loginToken = req.cookies.loginToken
        const user = authService.validateToken(loginToken)
        const { creator } = bugService.getById(bugId)
        if (user.username === creator.username ) await bugService.remove(bugId) 
        else throw 'Removing bug failed'
        res.send(`Removed ID ${bugId} succsesfully`)
    } catch(e) {
        console.log('error in server: ', e)
        res.status(400).send(`Couldn't remove bug`)
    }
}
