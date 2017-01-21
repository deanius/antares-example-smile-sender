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
