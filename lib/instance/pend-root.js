import { Micro } from '../micro'
import { findAppProps, defer } from '../helper/utils'

Micro.prototype.pendRoot = function (appName = '') {
    this.appsStore || (this.appsStore = {})
    this.appsStore[appName] || (this.appsStore[appName] = {})
    let cur = this
    let previousPendingPath = this.appsStore[appName].pendPath
    let currentPath = location.pathname
    if (currentPath !== previousPendingPath) {
        let rootDefer = defer()
        let props = findAppProps(appName, this.apps)
        props.root || (props.root = {})
        props.root.ready = rootDefer.promise
        this.appsStore[appName].rootDefer = rootDefer
        this.appsStore[appName].pendPath = currentPath
    }
    if (!this.pendRootListener) {
        this.pendRootListener = function () {
            cur.apps.forEach((app) => {
                cur.pendRoot(app.name)
            })
        }
        window.addEventListener('single-spa:before-routing-event', this.pendRootListener)
    }
    return this
}
