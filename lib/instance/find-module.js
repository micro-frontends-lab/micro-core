import { Micro } from '../micro'

Micro.prototype.findModule = function (moduleName = '') {
    return this.appsModules.find((mod) => {
        return mod.name === moduleName
    })
}
