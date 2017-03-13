import { AntaresMeteorInit, AntaresInit, inAgencyRun } from 'meteor/deanius:antares'
// TODO elaborate on this config
const AntaresConfig = {}

// Make our initialized Antares available
export const Antares = AntaresMeteorInit(AntaresInit)(AntaresConfig)

// Expose debugging variables
inAgencyRun('any', function () {
    Object.assign(this, {
        Antares
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
