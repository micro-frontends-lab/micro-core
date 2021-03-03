export function defer () {
    class Defered {
        constructor () {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        }
    }
    return new Defered()
}

export function findApp (name = '', apps = []) {
    return apps.find((app) => { return app.name === name })
}

export function findAppProps (name = '', apps = []) {
    let app = findApp(name, apps)
    if (!app) {
        throw new Error(`App ${name} not found.`)
    }
    app.props || (app.props = {})
    return app.props
}

export function createActiveRule (app = {}, modules = []) {
    let paths = modules.map((mod) => {
        return mod.path
    })
    app.activeRule = function (location) {
        return paths.some((path) => {
            return location.pathname.startsWith(path)
        })
        // return paths.includes(location.pathname)
    }
}

export function initDynamicProp (app = {}) {
    app.props || (app.props = {})
    app.props.dynamic || (app.props.dynamic = {})
}

export function setCacheProp (app = {}, appStore = {}, options = {}) {
    let cachable = options.cachable
    app.props || (app.props = {})
    app.props.cachable = cachable
    appStore.cachable = cachable
}

export function createRoot (app = {}, appStore = {}) {
    let appWrapper = appStore.appWrapper
    let rootEl = appStore.rootEl
    if (!appWrapper) {
        appWrapper = document.createElement('div')
        appWrapper.dataset.microApp = app.name
        appWrapper.id = app.name
        appStore.appWrapper = appWrapper
    }
    if (!rootEl) {
        rootEl = document.createElement('div')
        rootEl.dataset.microAppRoot = app.name
        appStore.rootEl = rootEl
        app.props || (app.props = {})
        app.props.root || (app.props.root = {})
        app.props.root.el = rootEl
    }
    if (!appWrapper.contains(rootEl)) {
        appWrapper.appendChild(rootEl)
    }
}

export function createRender (app = {}, appStore = {}) {
    app.render = function ({ appContent, loading }) {
        if (appStore.cachable && appStore.cached) {
            return
        }
        if (!loading) {
            appStore.rootEl.innerHTML = appContent
            if (!appStore.appWrapper.contains(appStore.rootEl) && !appContent) {
                appStore.appWrapper.innerHTML = ''
                createRoot(app, appStore)
            }
        }
    }
}
