import { mustBeString, mustBeObject, mustNotBeBlank } from './helper/validations'



export class Micro {
    constructor (name = '', env = '') {
        mustBeString(name)
        mustNotBeBlank(name)
        name = name.trim()
        env = env.trim()
        this.main = { name, env, namespace: `micro_${name}`.toUpperCase() }
        this.apps = []
        this.appsModules = []
        this.appsStore = {}
    }
}

export function micro (options = {}) {
    mustBeObject(options, 'Micro options')
    return new Micro(options.name, options.env)
}
