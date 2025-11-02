import { readJsonFile, writeJsonFile, makeId } from "./util.service.js"

const path = './data/bugs.json'

const bugs = readJsonFile(path)

export const bugService = {
    query,
    getById,
    remove,
    save,
}

function query() {
    try {
        return bugs
    } catch (e) { 
        console.log('error in bug service: ', e)
        throw new Error(e)
    }
}

function getById(bugId) {
    try {
        return bugs.find( (bug) => bug._id === bugId)
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    }
}

async function remove(bugId) {
   try {
        const indexToRemove = bugs.findIndex( (bug) => bug._id === bugId )
        if (indexToRemove === -1) {
            throw new Error('Id not found in remove')
        }
        bugs.splice(indexToRemove, 1)
        await writeJsonFile(path, bugs)
        return bugs
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}

async function save(bugToSave){
    try {
        console.log('bug to save: ', bugToSave)
        const indexToReplace = bugs.findIndex( (bug) => bug._id === bugToSave._id)
        if (indexToReplace !== -1) {
            bugs[indexToReplace] = { ...bugs[indexToReplace], ...bugToSave }
        } else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        // console.log('bugs: ', bugs)
        await writeJsonFile(path, bugs)
        return bugToSave
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}
