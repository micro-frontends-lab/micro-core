import { micro } from '../micro'

micro.singletonModules = function (appName = '', ...modules) {
    return modules.map((mod) => {
        mod.apps = [appName]
        mod.path || (mod.path = `/${appName}/${mod.name}`)
        return mod
    })
}
