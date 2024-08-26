export const NOT_LOADED = 'NOT_LOADED'
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'
export const LOAD_ERROR = 'LOAD_ERROR'

export const NOT_BOOTSTRAPED = 'NOT_BOOTSTRAPED'
export const BOOTSTRAPING = 'BOOTSTRAPING'
export const NOT_MOUNTED = 'NOT_MOUNTED'

export const MOUNTING = 'MOUNTING'
export const MOUNTED = 'MOUNTED'

export const UNMOUNTING = 'UNMOUNTING'

export function isActive(app) {
    return app.status === MOUNTED
}

export function shouldBeActive(app) {
    return app.activeWhen(window.location)
}

export function getAppChanges() {
 const appsToLoad = [], appsToMount = [], appsToUnmount = [];

 apps.forEach(app => {
    let appShouldBeActive = shouldBeActive(app)
    switch(app.status) {
        case NOT_LOADED:
        case LOADING_SOURCE_CODE:
            if (appShouldBeActive) {
                appsToLoad.push(app)
            }
            break;
        case NOT_BOOTSTRAPED:
        case BOOTSTRAPING:
        case NOT_MOUNTED:
            if (appShouldBeActive) {
                appsToMount.push(app)
            }
            break;
        case MOUNTED:
            if (!appShouldBeActive) {
                appsToUnmount.push(app)
            }
            break;
        default:
            break;
    }
 })

 return {
    appsToLoad,
    appsToMount,
    appsToUnmount
 }  
}