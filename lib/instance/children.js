import { Micro } from '../micro'
import { mustBeString, mustBeObject, validateName } from '../helper/validations'



function pickEntry (env, storageKey, name, entry) {

    let isChildDevelopmentMode = ['slave_development', 'child_development'].includes(env)
    let isMainDevelopmentMode = ['master_development', 'main_development', 'development'].includes(env)

    let mustFetchRemotely = !(isChildDevelopmentMode || isMainDevelopmentMode)
    // @yyl Child applications must be fetched from remote server under production
    // mode and test mode.
    if (mustFetchRemotely) {
        return entry.remote
    }

    let fetchingConfig = localStorage.getItem(storageKey)
    // @yyl If no fetching mode is setted, fetch child applications from remote
    // server under main application development mode, oppsitely fetch child
    // applications from localhosts.
    if (!fetchingConfig) {
        return isMainDevelopmentMode ? entry.remote : entry.local
    }

    fetchingConfig = JSON.parse(fetchingConfig)
    let {mode, only, except} = fetchingConfig
    let oppsiteMode = ({remote: 'local', local: 'remote'})[mode]
    // @yyl except takes a higher priority than only.
    // @yyl If except is setted, only child applications excluded in this option
    // will use the setted fetching mode.
    if (except && except.includes(name)) {
      return entry[oppsiteMode]
    }
    // @yyl If only is setted, only child applications included in this option
    // will use the setted fetching mode.
    if (only && !only.includes(name)) {
      return entry[oppsiteMode]
    }
    return entry[mode]
}

Micro.prototype.children = function (...children) {
    children.forEach((chd) => {
        validateName(chd, children)
        mustBeObject(chd.entry, `Child application ${chd.name} entry`)
        mustBeString(chd.entry.remote, `Child application ${chd.name} remote entry`)
        mustBeString(chd.entry.local, `Child application ${chd.name} local entry`)
        chd.entry = pickEntry(this.main.env, this.main.namespace, chd.name, chd.entry)
    })
    this.apps = children
    return this
}
