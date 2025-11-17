import { readJsonFile, writeJsonFile, makeId } from "../../services/util.service.js"

const path = './data/user.json'

const users = readJsonFile(path)

const resultsPerPage = users.length

export const userService = {
    query,
    getByUsername,
    getById,
    remove,
    create,
    update,
}

function query(filterBy = {}, sortBy='', sortDir='', pageIdx=1) {

    let users = readJsonFile(path)

    try {
        return users
    } catch(e) { 
        console.log('error in user service: ', e)
        throw new Error(e)
    }
}

function getByUsername(username){
    try {
        return users.find( (user) => user.username === username )
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    }
}

function getById(userId) {
    try {
        return users.find( (user) => user._id === userId )
    } catch(e) {
        console.log('error in user service: ', e)
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
        console.log('error in user service: ', e)
        throw new Error(e)
    } 
}

async function create(userToCreate){
    try {
        const newUser = { ...userToCreate, _id: makeId() }
        users.push(newUser)
        await writeJsonFile(path, users)
        return newUser
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    } 
}

async function update(userToUpdate){
    try {
        const indexToReplace = users.findIndex( (user) => user._id === userToUpdate._id)
        if (indexToReplace === -1) {
            throw new Error('Id not found in update')
        }
        users[indexToReplace] = { ...users[indexToReplace], ...userToUpdate }
        await writeJsonFile(path, users)
        return users[indexToReplace]
    } catch(e) {
        console.log('error in user service: ', e)
        throw new Error(e)
    } 
}
