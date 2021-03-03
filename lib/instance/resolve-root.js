import { Micro } from '../micro'
import { findAppProps } from '../helper/utils'

Micro.prototype.resolveRoot = function (appName = '', rootElement = null) {
    let props = findAppProps(appName, this.apps)
    props.root.el = rootElement
    this.appsStore[appName].rootDefer.resolve(rootElement)
    return this
}
