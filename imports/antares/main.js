import { AntaresMeteorInit, AntaresInit } from 'meteor/deanius:antares'
// TODO elaborate on this config
const AntaresConfig = {}

// Make our initialized Antares available
export const Antares = AntaresMeteorInit(AntaresInit)(AntaresConfig)
