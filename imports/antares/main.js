import { AntaresMeteorInit, AntaresInit, inAgencyRun } from 'meteor/deanius:antares'
import { Mongo } from 'meteor/mongo'

// TODO elaborate on this config
const AntaresConfig = {}

// Make our initialized Antares available
export const Antares = AntaresMeteorInit(AntaresInit)(AntaresConfig)
const { mongoRendererFor } = Antares
let Smiles = process.env.MONGO_URL && new Mongo.Collection('Smiles')

// Expose debugging variables
inAgencyRun('any', function () {
    Object.assign(this, {
        Antares,
        Smiles
    })
})

inAgencyRun('client', () => {
    // Tell us all the news !
    Antares.subscribe('*')
})

inAgencyRun('server', () => {
    // Allow us to handle actions targeting a key 'Declan'
    Antares.announce({
        type: 'Antares.store',
        payload: {},
        meta: {
            antares: {
                key: 'Declan',
                localOnly: true
            }
        }
    })
})

console.log('MONGO_URL', process.env.MONGO_URL)
inAgencyRun('server', () => {
    Antares.subscribeRenderer(({ action }) => {
        if (process.env.MONGO_URL) {
            console.log('MDB> ', action)
            Smiles.insert(action)
            // will change:
            // Smiles.find().count()
        }
    })
})
