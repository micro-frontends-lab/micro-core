import { Micro } from '../micro'
import { findApp } from '../helper/utils'
import { mustBeString, mustBeArray, validateName } from '../helper/validations'

function validateAppNames (appNames = [], apps = []) {
    mustBeArray(appNames, 'Module apps')
    appNames.forEach((name) => {
        if (!findApp(name, apps)) {
            throw new Error(`${name} is not a registered app.`)
        }
    })
}

function joinModules (apps = [], modules = []) {
    let all = []
    modules.forEach((mod) => {
        all = all.concat(mod)
    })
    all.forEach((mod) => {
        mustBeString(mod.path, 'Module path')
        mustBeString(mod.title, 'Module title')
        validateName(mod, all, 'Module')
        validateAppNames(mod.apps, apps)
    })
    return all
}

Micro.prototype.modules = function (...modules) {
    this.appsModules = joinModules(this.apps, modules)
    return this
}
