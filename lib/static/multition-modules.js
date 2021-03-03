import { micro } from '../micro'

micro.multitionModules = function (appNames = [], ...modules) {
    return modules.map((mod) => {
        mod.apps = appNames
        mod.path || (mod.path = `/${appNames.join('-')}/${mod.name}`)
        return mod
    })
}
