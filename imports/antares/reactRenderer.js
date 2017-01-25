import { Antares } from '/imports/antares/main'
import { inAgencyRun } from 'meteor/deanius:antares'
import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from 'react-mounter'

const eventHandlers = {
    sendASmile: () => {
        Antares.announce('smile!')
    }
}

const WelcomeComponent = ({ sendASmile }) => (
    <div>
    <p>Ho Hum.</p>
    <button onClick={ sendASmile }>Send A Smile!</button>
    </div>
)

const Smiler = ({ sendASmile }) => (
    <div>
        <div style={{ fontSize: '1000%' }}>:)</div>
        <br/>
        <button onClick={ sendASmile }>Send A Smile!</button>
    </div>
)

const welcomeElement = <WelcomeComponent { ...eventHandlers } />
const smilerElement = <Smiler { ...eventHandlers } />

// ensure we have a #react-root upon load
mount(()=>(welcomeElement))
let reactRoot

const { Rx } = Antares
const cancelTimers = new Rx.Subject

// A function that can be run in order to change the contents of react-root
// sets up a delay
const reactRenderer = ({ action }) => {
    reactRoot = document.getElementById('react-root')
    ReactDOM.render(smilerElement, reactRoot)

    cancelTimers.next(Rx.Observable.timer(2000))
}

// Via 'switch', we only follow the most recent delay, canceling the previous
const mostRecentCancel = cancelTimers.asObservable().switch()

// actually cancel, each time a mostRecentCancel timer comes due
mostRecentCancel.subscribe(() => {
    ReactDOM.render(welcomeElement, reactRoot)
})

// Only on the client side, we subscribe this renderer to run upon the 
// appropriate actions being received. 
// This differs from Epics
//  Epics: in response to actions, trigger additional actions within system
//  Renderers: in response to actions, cause changes outside our system
//    ^ Note a database or any external process is considered 'outside'
//      because it is fundamentally farther away / more expensive
inAgencyRun('client', () => {
    Antares.subscribeRenderer(reactRenderer, {
        xform: action$ =>
                action$.filter(({ action }) => action.type === 'smile!')
    })
})
