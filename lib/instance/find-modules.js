import { Micro } from '../micro'

Micro.prototype.findModules = function (appName = '', type = 'all') {
    return this.appsModules.filter((mod) => {
        let belongsToApp = appName === '*' ? true : mod.apps.includes(appName)
        if (type === 'all') {
            return belongsToApp
        } else if (type === 'singleton') {
            return belongsToApp && mod.apps.length === 1
        } else if (type === 'multition') {
            return belongsToApp && mod.apps.length > 1
        }
    })
}
