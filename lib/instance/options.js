import { Micro } from '../micro'

Micro.prototype.options = function (config = {}) {
    typeof config.prefetch === 'boolean' || (config.prefetch = false)
    typeof config.jsSandbox === 'boolean' || (config.jsSandbox = false)
    typeof config.singular === 'boolean' || (config.singular = false)
    typeof config.cachable === 'boolean' || (config.cachable = true)
    this.appOptions = config
    return this
}
