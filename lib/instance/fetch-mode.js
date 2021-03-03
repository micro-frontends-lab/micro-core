import { Micro } from '../micro'
import { mustBeStringOrArray } from '../helper/validations'


function isDev (env) {
    return [
        'development',
        'master_development',
        'child_development',
        'slave_development'].includes(env)
}

function persistFetchingMode(mode, storageKey, options) {
    let storageData = {mode}
    let {only, except} = options
    if (except) {
        mustBeStringOrArray(except)
        storageData.except = Array.isArray(except) ? except : [except]
    } else if (only) {
        mustBeStringOrArray(only)
        storageData.only = Array.isArray(only) ? only : [only]
    }
    localStorage.setItem(storageKey, JSON.stringify(storageData))
    location.reload()
}

Micro.prototype.fetchRemotely = function (options = {}) {
    isDev && persistFetchingMode('remote', this.main.namespace, options)
    return this
}

Micro.prototype.fetchLocally = function (options = {}) {
    isDev && persistFetchingMode('local', this.main.namespace, options)
    return this
}

Micro.prototype.resetFetchingMode = function () {
    if (isDev) {
        localStorage.removeItem(this.main.namespace)
        location.reload()
    }
    return this
}
