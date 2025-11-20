import { dbService } from "../../services/db.service.js"
import { ObjectId } from "mongodb"

const collectionName = 'msg'

export const msgService = {
    query,
    getById,
    remove,
    save,
}

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const criteria = _buildCriteria(filterBy)
        const msgs = await collection.find(criteria).toArray()
        return msgs
    } catch (e) {
        console.log('error in msg service: ', e)
        throw new Error(e)
    }
}

async function getById(msgId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const criteria = { _id: _buildId(msgId) }
        const msg = await collection.findOne(criteria)
        if (!msg) throw new Error('Id not found')
        return msg
    } catch (e) {
        console.log('error in msg service: ', e)
        throw new Error(e)
    }
}

async function remove(msgId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const criteria = { _id: _buildId(msgId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        if (!deletedCount) throw new Error('Id not found in remove')
        return deletedCount
    } catch (e) {
        console.log('error in msg service: ', e)
        throw new Error(e)
    }
}

async function save(msgToSave, user) {
    try {
        const collection = await dbService.getCollection(collectionName)

        const msgToPersist = {
            txt: msgToSave.txt,
            aboutBugId: msgToSave.aboutBugId ? _buildId(msgToSave.aboutBugId) : undefined,
            byUserId: _buildId(user._id),
        }

        if (!msgToPersist.aboutBugId) delete msgToPersist.aboutBugId

        if (msgToSave._id) {
            const msgId = _buildId(msgToSave._id)
            const { matchedCount } = await collection.updateOne({ _id: msgId }, { $set: msgToPersist })
            if (!matchedCount) throw new Error('Id not found in save')
            return collection.findOne({ _id: msgId })
        } else {
            const { insertedId } = await collection.insertOne(msgToPersist)
            return collection.findOne({ _id: insertedId })
        }
    } catch (e) {
        console.log('error in msg service: ', e)
        throw new Error(e)
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.aboutBugId) criteria.aboutBugId = _buildId(filterBy.aboutBugId)
    if (filterBy.byUserId) criteria.byUserId = _buildId(filterBy.byUserId)
    return criteria
}

function _buildId(id) {
    if (!id) return id
    if (id instanceof ObjectId) return id
    if (typeof id === 'object' && id._id) return _buildId(id._id)
    if (typeof id !== 'string') return id
    try {
        return ObjectId.createFromHexString(id)
    } catch {
        return id
    }
}
