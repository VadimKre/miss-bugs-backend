import { msgService } from "./msg.service.js"

export async function getMsgs(req, res) {
    const filterBy = req.query.filterBy || {}
    try {
        const msgs = await msgService.query(filterBy)
        res.send(msgs)
    } catch (e) {
        console.log('error in server: ', e)
        res.status(400).send(`Msgs not found`)
    }
}

export async function getMsgById(req, res) {
    try {
        const { msgId } = req.params
        const msg = await msgService.getById(msgId)
        res.send(msg)
    } catch (e) {
        console.log('error in server: ', e)
        res.status(400).send(`Msg not found`)
    }
}

export async function saveMsg(req, res) {
    try {
        const user = req.user
        if (!user) return res.status(401).send('Not authorized')
        const msgToSave = req.body
        const msg = await msgService.save(msgToSave, user)
        res.send(msg)
    } catch (e) {
        console.log('error in server: ', e)
        res.status(400).send(`Saving msg failed`)
    }
}

export async function removeMsg(req, res) {
    try {
        const user = req.user
        if (!user?.isAdmin) return res.status(401).send('Not authorized')
        const { msgId } = req.params
        await msgService.remove(msgId)
        res.send(`Removed ID ${msgId} succsesfully`)
    } catch (e) {
        console.log('error in server: ', e)
        res.status(400).send(`Couldn't remove msg`)
    }
}
