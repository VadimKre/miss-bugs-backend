import { dbService } from "../../services/db.service.js"
import { ObjectId } from "mongodb"

const collectionName = 'user'

export const userService = {
    query,
    getByUsername,
    getById,
    remove,
    create,
    update,
}

async function query() {
    try {
        const collection = await dbService.getCollection(collectionName)
        return collection.find().toArray()
    } catch (e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    }
}

async function getByUsername(username){
    try {
        const collection = await dbService.getCollection(collectionName)
        return collection.findOne({ username })
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const criteria = { _id: _buildId(userId) }
        const user = await collection.findOne(criteria)
        if (!user) throw new Error('Id not found')
        return user
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const criteria = { _id: _buildId(userId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        if (!deletedCount) throw new Error('Id not found in remove')
        return deletedCount
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    } 
}

async function create(userToCreate){
    try {
        const collection = await dbService.getCollection(collectionName)
        const userToInsert = { ...userToCreate }
        delete userToInsert._id
        const { insertedId } = await collection.insertOne(userToInsert)
        return collection.findOne({ _id: insertedId })
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    } 
}

async function update(userToUpdate){
    try {
        const collection = await dbService.getCollection(collectionName)
        const userId = _buildId(userToUpdate._id)
        const userToSet = { ...userToUpdate }
        delete userToSet._id
        const { matchedCount } = await collection.updateOne({ _id: userId }, { $set: userToSet })
        if (!matchedCount) throw new Error('Id not found in update')
        return collection.findOne({ _id: userId })
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    } 
}

function _buildId(userId) {
    if (typeof userId === 'object') return userId
    try {
        return ObjectId.createFromHexString(userId)
    } catch {
        return userId
    }
}
