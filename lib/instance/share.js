import { Micro } from '../micro'
import { mustBeString, mustBeObject, mustNotBeBlank } from '../helper/validations'

Micro.prototype.share = function (globalName = '', shared = {}) {
    mustBeString(globalName, 'globalName')
    mustNotBeBlank(globalName, 'globalName')
    mustBeObject(shared, 'shared')
    Object.defineProperty(window, globalName, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: Object.freeze(shared)
    })
    return this
}
