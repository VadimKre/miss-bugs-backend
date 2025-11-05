import { readJsonFile, writeJsonFile, makeId } from "../../services/util.service.js"

const path = './data/bugs.json'

const bugs = readJsonFile(path)

export const bugService = {
    query,
    getById,
    remove,
    save,
}

function query(filterBy = {}, sortBy='') {

    let bugs = readJsonFile(path)

    try {
        filterBy.title && (bugs = bugs.filter( (bug) => bug.title.toLowerCase().includes(filterBy.title.toLowerCase())))
        filterBy.severityMin && (bugs = bugs.filter( (bug) => bug.severity >= filterBy.severityMin))
        filterBy.severityMax && (bugs = bugs.filter( (bug) => bug.severity <= filterBy.severityMax))
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
        const indexToReplace = bugs.findIndex( (bug) => bug._id === bugToSave._id)
        if (indexToReplace !== -1) {
            bugs[indexToReplace] = { ...bugs[indexToReplace], ...bugToSave }
        } else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        await writeJsonFile(path, bugs)
        return bugToSave
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}
