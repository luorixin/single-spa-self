import { reroute } from "../navigation/reroute"
import { NOT_LOADED } from "./app.helper"

export const apps = []

export function registerApplication(appName, loadApp, activeWhen, customProps) {
    const registeration = {
        name: appName,
        loadApp,
        activeWhen,
        customProps,
        status: NOT_LOADED
    }
    apps.push(registeration)

    // 需要给每个应用添加状态
    reroute() // 重写路由
}