import { registerMicroApps } from 'qiankun'
import { Micro } from '../micro'
import { createActiveRule, createRender, createRoot, setCacheProp, initDynamicProp } from '../helper/utils'

Micro.prototype.register = function (options) {
    if (this._isRegistered) { return this }
    this.appLifecycles || this.lifecycles()
    this.appOptions || this.options(options)
    this.appsStore || (this.appsStore = {})
    this.apps.forEach((app) => {
        // this.pendRoot(app.name)
        this.appsStore[app.name] || (this.appsStore[app.name] = {})
        initDynamicProp(app)
        createRoot(app, this.appsStore[app.name])
        setCacheProp(app, this.appsStore[app.name], this.appOptions)
        app.activeRule || createActiveRule(app, this.findModules(app.name))
        app.render || createRender(app, this.appsStore[app.name], this.appOptions)
    })
    registerMicroApps(this.apps, this.appLifecycles, this.appOptions)
    return this
}
