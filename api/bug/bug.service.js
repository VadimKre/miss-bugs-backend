import { readJsonFile, writeJsonFile, makeId } from "../../services/util.service.js"
import { dbService } from "../../services/db.service.js"
import { ObjectId } from "mongodb"

const path = './data/bugs.json'

// const bugs = readJsonFile(path)

const resultsPerPage = 3

const collectionName = 'bug'

export const bugService = {
    query,
    getById,
    remove,
    save,
}

async function query(filterBy = {}, sortBy='', sortDir='', pageIdx=1) {

    // let bugs = await readJsonFile(path)

    console.log('filterBy: ', filterBy)

    try {
        // filterBy.title && (bugs = bugs.filter( (bug) => bug.title.toLowerCase().includes(filterBy.title.toLowerCase()) ))
        // filterBy.severityMin && (bugs = bugs.filter( (bug) => bug.severity >= filterBy.severityMin ))
        // filterBy.severityMax && (bugs = bugs.filter( (bug) => bug.severity <= filterBy.severityMax ))
        // filterBy.creator && (bugs = bugs.filter( (bug) => bug.creator._id === filterBy.creator._id ))
        // filterBy.labels && (bugs = bugs.filter( 
        //     (bug) =>  bug.labels.find( 
        //         (label) => filterBy.labels.find( 
        //             (l) => label.toLowerCase().includes(l.toLowerCase()) ) )))

        // sortBy === 'title' && (bugs = bugs.sort( (a,b) => a.title.localeCompare(b.title) ))
        // sortBy === 'severity' && (bugs = bugs.sort( (a,b) => a.severity - b.severity ))
        // sortBy === 'createdAt' && (bugs = bugs.sort( (a,b) => a.createdAt - b.createdAt ))

        // const totalPages = Math.ceil(bugs.length / resultsPerPage)

        // if (sortBy && sortDir === 'desc') bugs = bugs.reverse()

        // bugs = bugs.splice((pageIdx - 1) * resultsPerPage, resultsPerPage)

        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(collectionName)
        // var bugCursor = await collection.find(criteria)

        var totalBugs = await collection.countDocuments(criteria)

        console.log('totalBugs: ', totalBugs)

        var totalPages = Math.ceil(totalBugs / resultsPerPage)

        console.log('total pages: ', totalPages)
        
        const sort = _buildSort(sortBy, sortDir)
        let bugCursor = collection.find(criteria).collation({ locale: 'en', strength: 2 })
        if (Object.keys(sort).length) bugCursor = bugCursor.sort(sort)

        const bugs = await bugCursor.skip(( pageIdx - 1 ) * resultsPerPage ).limit(resultsPerPage).toArray()

        // console.log('bugs: ', bugs)

        return { bugs: bugs, totalPages: totalPages }
    } catch(e) { 
        console.log('error in bug service: ', e)
        throw new Error(e)
    }
}

async function getById(bugId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(bugId)} // ADD ObjectId.createFromHexString(bugId)

        const collection = await dbService.getCollection(collectionName)

        let bug = await collection.findOne(criteria)
        if (!bug) throw new Error('id not found')
        bug.createdAt = bug._id.getTimestamp() 

        return bug
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    }
}

async function remove(bugId) {
   try {

        const criteria = { _id: ObjectId.createFromHexString(bugId)} // ADD ObjectId.createFromHexString(bugId)

        const collection = await dbService.getCollection(collectionName)

        let bug = collection.deleteOne(criteria)

        return 

    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}

async function save(bugToSave, user){
    try {
        const collection = await dbService.getCollection(collectionName)

        if (bugToSave._id) {
            const bugId = ObjectId.createFromHexString(bugToSave._id)
            const bugToUpdate = { ...bugToSave }
            delete bugToUpdate._id

            const { matchedCount } = await collection.updateOne({ _id: bugId }, { $set: bugToUpdate })
            if (!matchedCount) throw new Error('Id not found in save')

            const updatedBug = await collection.findOne({ _id: bugId })
            updatedBug.createdAt = updatedBug._id.getTimestamp()
            return updatedBug
        } else {
            const bugToInsert = { ...bugToSave, creator: user }
            delete bugToInsert._id

            const { insertedId } = await collection.insertOne(bugToInsert)
            const newBug = await collection.findOne({ _id: insertedId })
            newBug.createdAt = newBug._id.getTimestamp()
            return newBug
        }
    } catch(e) {
        console.log('error in bug service: ', e)
        throw new Error(e)
    } 
}

function _buildCriteria(filterBy) {

    const criteria = {}
    
    filterBy.title && (criteria.title = { $regex: filterBy.title, $options: 'i' })
    filterBy.severityMin && (criteria.severity = { $gte: Number(filterBy.severityMin) })
    filterBy.severityMax && (criteria.severity = { $lte: Number(filterBy.severityMax) })
    filterBy.creator && (bugs = bugs.filter( (bug) => bug.creator._id === filterBy.creator._id ))

    if (filterBy.labels) {
        const labelQueries = filterBy.labels.map((label) => ({ labels: { $regex: label, $options: 'i' } }))
        if (labelQueries.length === 1) {
            criteria.labels = labelQueries[0].labels
        } else if (labelQueries.length) {
            criteria.$or = criteria.$or ? criteria.$or.concat(labelQueries) : labelQueries
        }
    }
    
    
    return criteria
}


function _buildSort(sortBy, sortDir) {

    if (!sortBy) return {}

    const sort = {}
    const direction = sortDir === 'desc' ? -1 : 1

    sortBy === 'title' && (sort.title = direction)
    sortBy === 'severity' && (sort.severity = direction)
    sortBy === 'createdAt' && (sort.createdAt = direction)

    return sort
}

// async function script(){
//     const collection = await dbService.getCollection(collectionName)

//     collection.find({ _id: { $type: "string" } }).forEach(doc => {
//         const oldId = doc._id
//         delete doc.createdAt 
//         doc.legacyId = oldId 
//         doc._id = new ObjectId()

//         collection.insertOne(doc) 
//         collection.deleteOne({ _id: oldId }) 
//     })
// }
