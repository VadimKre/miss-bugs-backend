import { readJsonFile, writeJsonFile, makeId } from "../../services/util.service.js"

const path = './data/user.json'

const users = readJsonFile(path)

const resultsPerPage = users.length

export const userService = {
    query,
    getById,
    remove,
    save,
}

function query(filterBy = {}, sortBy='', sortDir='', pageIdx=1) {

    let users = readJsonFile(path)

    try {
        return users
    } catch(e) { 
        console.log('error in bug service: ', e)
        throw new Error(e)
    }
}

function getById(userId) {
    try {
        return users.find( (user) => user._id === userId )
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    }
}

async function remove(userId) {
   try {
        const indexToRemove = users.findIndex( (user) => user._id === userId )
        if (indexToRemove === -1) {
            throw new Error('Id not found in remove')
        }
        users.splice(indexToRemove, 1)
        await writeJsonFile(path, users)
        return users
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}

async function save(userToSave){
    try {
        const indexToReplace = users.findIndex( (user) => user._id === userToSave._id)
        if (indexToReplace !== -1) {
            users[indexToReplace] = { ...users[indexToReplace], ...userToSave }
        } else {
            userToSave._id = makeId()
            bugs.push(bugToSave)
        }
        await writeJsonFile(path, users)
        return userToSave
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}
