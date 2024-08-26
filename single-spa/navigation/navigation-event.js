import { reroute } from "./reroute"

function urlRoute() {
    reroute(arguments)
}

window.addEventListener('hashchange', urlRoute)
window.addEventListener('popstate', urlRoute)

const capturedEventListeners = {
    hashchange: [],
    popstate: []
}

const listeningTo = ['hashchange', 'popstate']

const originAddEventListener = window.addEventListener
const originRemoveEventListener = window.removeEventListener

window.addEventListener = function(eventName, callback) {
    if (listeningTo.includes(eventName) && !capturedEventListeners[eventName].some(listener => listener === callback)) {
        return capturedEventListeners[eventName].push(callback)
    }
    return originAddEventListener.apply(this. arguments)
}

window.removeEventListener = function(eventName, callback) {
    if (listeningTo.includes(eventName)) {
        capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(listener => listener !== callback)
        return
    }
    return originRemoveEventListener.apply(this. arguments)
}

export function callCaptureEventListeners(e) {
    if (e) {
        const eventType = e[0].type
        if (listeningTo.includes(eventType)) {
            capturedEventListeners[eventType].forEach(listener => {
                listener.apply(this, e)
            })
        }
    }
}

function patchFn(updateState, methodName) {
    return function() {
        const urlBefore = window.location.href
        const r = updateState.apply(this, arguments)
        const urlAfter = window.location.href
        if (urlBefore !== urlAfter) {
            window.dispatchEvent(new PopStateEvent('popstate'))
        }
        return r
    }
}

window.history.pushState = patchFn(window.history.pushState, 'pushState')

window.history.replaceState = patchFn(window.history.replaceState, 'replaceState')