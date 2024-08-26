import { LOADING_SOURCE_CODE, MOUNTED, NOT_MOUNTED, UNMOUNTING } from "../application/app.helper"

export function toUnmountPromise(app) {
    return Promise.resolve().then(() => {
        if (app.staus !== MOUNTED) {
            return app
        }
        app.staus = UNMOUNTING
        return app.unmount(app.customProps).then(v => {
            app.status = NOT_MOUNTED
        })
    })
}