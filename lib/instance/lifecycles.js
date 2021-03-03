import { Micro } from '../micro'
import { mustBeObject } from '../helper/validations'

Micro.prototype.lifecycles = function (config = {
    // beforeLoad () { },
    // beforeMount () { },
    // afterMount () { },
    // beforeUnMount () { },
    // afterUnmount () { }
}) {
    mustBeObject(config, 'config')
    let cur = this
    let oldAfterMount = config.afterMount
    let afterMount = function (app) {
        let cachable = cur.appsStore[app.name]
        if (cachable) {
            cur.appsStore[app.name].cached = true
        }
    }
    if (oldAfterMount) {
        config.afterMount = function (app) {
            afterMount(app)
            oldAfterMount(app)
        }
    } else {
        config.afterMount = afterMount
    }
    this.appLifecycles = config
    return this
}
