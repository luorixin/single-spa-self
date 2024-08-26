import { getAppChanges, shouldBeActive } from "../application/app.helper";
import { toBootstrapPromise } from "../lifecycle/bootstrap";
import { toLoadPromise } from "../lifecycle/load";
import { toMountPromise } from "../lifecycle/mount";
import { toUnmountPromise } from "../lifecycle/unmount";
import { started } from "../start";
import './navigation-event'
import { callCaptureEventListeners } from "./navigation-event";

let appChanngeUnderWay = false
let peopleWaitinngOnAppChange = []
export function reroute(event) {

    if (appChanngeUnderWay) {
        return new Promise((resolve, reject) => {
            peopleWaitinngOnAppChange.push({
                resolve,
                reject
            })
        })
    }

    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges()
    function loadApps() {
        return Promise.all(appsToLoad.map(toLoadPromise)).then(callEventListener)
    }
    function performAppChange() {
        const unMountAllPromises =  Promise.all(appsToUnmount.map(toUnmountPromise))

        const loadMountPromises = Promise.all(appsToLoad.map(app => toLoadPromise(app).then(app => {
            // 当应用加载完毕后需要启动挂载，但要保证卸载老的
            return tryBootstrapAndMount(app, unMountAllPromises)
        })))

        const mountPromises = Promise.all(appsToMount.map(app => tryBootstrapAndMount(app, unMountAllPromises)))
        
        function tryBootstrapAndMount(app, unMountAllPromises) {
            if (shouldBeActive(app)) {
                return toBootstrapPromise(app).then(app => unMountAllPromises.then(() => toMountPromise(app)))
            }
        }

        return Promise.all([loadMountPromises, mountPromises]).then(() => {
            callEventListener()
            appChanngeUnderWay = false
        })
    }

    function callEventListener() {
        callCaptureEventListeners(event)
    }

    if(started) {
        appChanngeUnderWay = true
        return performAppChange()
    }
    return loadApps()
}