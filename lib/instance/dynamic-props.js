import { Micro } from '../micro'
import { mustBeObject } from '../helper/validations'
import { findAppProps } from '../helper/utils'

Micro.prototype.dynamicProps = function (appName = '', props = {}) {
    mustBeObject(props)
    let appProps = findAppProps(appName, this.apps)
    let clonedProps = JSON.parse(JSON.stringify(props))
    Object.assign(appProps.dynamic, clonedProps)
    return this
}
