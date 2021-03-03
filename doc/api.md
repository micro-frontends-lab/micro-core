# micro-core API文档

## 数据结构

```bash
@typedef {Object} AppConf - 主应用配置
@property {string} name - 主应用名称
@property {string} env - 应用运行环境可选值如下：
                         development/main_development: 主应用开发模式, 默认从子应用remote entry使用fetch方式加载子应用资源;
                         child_development: 子应用开发模式, 默认从子应用local entry使用fetch方式加载子应用资源;
                         production: 生产环境，从子应用remote entry使用fetch方式加载子应用资源;
                         test: 测试环境，从子应用remote entry使用fetch方式加载子应用资源。
```

```bash
@typedef {Object} ChildAppConf - 子应用配置
@property {string} name - 子应用唯一名称
@property {Object} entry - 子应用加载入口地址
@property {string} entry.remote - 子应用远程加载地址
@property {string} entry.local - 子应用本地加载地址
@property {Object} [props] - 需要传递到子应用的静态数据
```

```bash
@typedef {Object} ModuleConf - 子应用模块配置
@property {string} name - 子应用唯一模块名称
@property {string} [path] - 可选的子应用模块路径
```

```bash
@typedef {Object} Module - 子应用模块数据对象
@property {string} name - 子应用唯一模块名称
@property {string} path - 子应用模块路径
@property {Array} apps - 子应用模块关联的应用名称数组
```

```bash
@typedef {Array} Modules - 子应用模块数据对象数组
```

```bash
@typedef {Object} LifecycleConf - 子应用生命周期钩子函数配置
@property {Function} beforeLoad - 子应用加载前钩子函数
@property {Function} beforeMount - 子应用每次挂载前钩子函数
@property {Function} afterMount - 子应用每次挂载后钩子函数
@property {Function} beforeUnmount  - 子应用每次卸载前钩子函数
@property {Function} afterUnmount - 子应用每次卸载后钩子函数
```

```bash
@typedef {Object} OptionConf - 子应用选项配置
@property {boolean} prefetch = false - 是否预加载未激活的子应用
@property {boolean} jsSandbox = false - 是否启用沙箱模式
@property {boolean} singular = false - 是否启用单例模式
@property {boolean} cachable = true - 是否开启缓存模式
```

```bash
@typedef {Object} MicroInstance - 通过micro构造函数生成的对象实例
@property {Object} main - 主应用数据对象
@property {Array} apps - 子应用ChildAppConf数据数组
@property {Modules} appsModules
```


## 构造函数

### micro (app)

创建 `MicroInstance` 实例。

```bash
@param {AppConf} app
@returns {MicroInstance}
```

```javascript
// @example
let microApp = micro({name: 'MicroMain', env: 'development'})
```

## 静态方法

### .multitionModules (childAppNames, module1, module2...)

生成子应用多例模块数据对象。

```bash
@param {Array} childAppNames
@param {ModuleConf} module1[, module2, ...]
@returns {Modules}
```

```javascript
// @example
micro.multitionModules(['MicroChildOne', 'MicroChildTwo'],
  {
    name: 'Dashboard',
    title: '工作台'
  }
)
```

### .singletonModules (childAppName, module1, module2...)

生成子应用单例模块数据对象。

```bash
@param {string} childAppName
@param {ModuleConf} module1[, module2, ...]
@returns {Modules}
```

```javascript
// @example
micro.singletonModules('MicroChildOne',
  {
    name: 'Customer',
    title: '客户管理'
  }, {
    name: 'Storage',
    title: '库存管理'
  }
)
```

## 实例方法

### .children (childApp1, childApp2, ...)

```bash
@param {ChildAppConf} childApp1[, childApp2, ...]
@returns {MicroInstance}
```

```javascript
// @example
microApp.children({
  name: 'MicroChildOne',
  entry: {
    local: 'http://localhost:8081',
    remote: 'https://childonedomain.com'
  },
  props: { token: '12345' }
},
{
  name: 'MicroChildTwo',
  entry: {
    local: 'http://localhost:8082',
    remote: 'https://childtwodomain.com'
  },
  props: { token: '45678' }
})
```

### .dynamicProps (childAppName, props)

向指定子应用传递动态props。

```bash
@param {string} childAppName
@param {Object} props
@returns {MicroInstance}
```

```javascript
// @example
microApp.dynamicProps('MicroChildOne', {myProperty: 'value'})
```

### .fetchLocally (options)

覆盖默认的子应用加载模式，使用子应用local entry加载子应用资源。
此方法只在子应用开发模式或主应用开发模式下有效，应在浏览器控制台中调用，避免在代码中调用。

```bash
@param {Object} [options]
@param {string | Array} options.only
@param {string | Array} options.except
@returns {MicroInstance}
```

```javascript
// @example 所有子应用均从local entry加载
microApp.fetchLocally()
// @example 只有MicroChildOne从local entry加载，其它子应用均从remote entry加载。
microApp.fetchLocally({only: 'MicroChildOne'})
// @example 只有MicroChildOne从remote entry加载，其他子应用均从local entry加载。
microApp.fetchLocally({except: 'MicroChildOne'})
```

### .fetchRemotely (options)

覆盖默认的子应用加载模式，使用子应用remote entry加载子应用资源。
此方法只在子应用开发模式或主应用开发模式下有效，应在浏览器控制台中调用，避免在代码中调用。

```bash
@param {Object} [options]
@param {string | Array} options.only
@param {string | Array} options.except
@returns {MicroInstance}
```

```javascript
// @example 所有子应用均从remote entry加载
microApp.fetchRemotely()
// @example 只有MicroChildOne从remote entry加载，其它子应用均从local entry加载。
microApp.fetchRemotely({only: 'MicroChildOne'})
// @example 只有MicroChildOne从local entry加载，其他子应用均从remote entry加载。
microApp.fetchRemotely({except: 'MicroChildOne'})
```

### .findModule (moduleName)

查找指定名称的子应用模块数据。

```bash
@param {string} moduleName
@returns {Module}
```

```javascript
// @example
microApp.findModule('customer')
```

### .lifecycles (conf)

定义子应用生命周期钩子函数。

```bash
@param {LifecycleConf} conf
@returns {MicroInstance}
```

```javascript
// @example
microApp.lifecycles({
  beforeLoad (app) {
    console.log('Before loading app.')
  }
})
```

### .matchingApps ()

查找当前路由下会被激活的应用名称数组。

```bash
@returns {Array}
```

```javascript
// @example
microApp.matchingApps()
```

### .modules (modules1, modules2, ...)

注册子应用模块。

```bash
@param {Modules} modules1[, modules2, ...]
@returns {MicroInstance}
```

```javascript
// @example
microApp.modules(
  micro.singletonModules('MicroChildOne',
    {
      name: 'Customer',
        title: '客户管理'
    }, {
        name: 'Storage',
        title: '库存管理'
    }
  ),
  micro.singletonModules('MicroChildTwo',
    {
      name: 'Order',
      title: '订单管理'
    }
  ),
  micro.multitionModules(['MicroChildOne', 'MicroChildTwo'],
    {
      name: 'Dashboard',
      title: '工作台'
    }
  )
)
```

### .options (opts)

设置实例参数。

```bash
@param {OptionConf} opts
@returns {MicroInstance}
```

```javascript
// @example
microApp.options({
  prefetch: false,
  jsSandbox: false,
  singular: false,
  cachable: true
})
```

### .register (options)

将 `micro-core` 中注册的应用及模块同步至 `qiankun` 和 `single-spa` 配置中。参数 `options`
可选，相当于直接传递进实例方法 `.options()`.

```bash
@param {OptionConf} [options]
@returns {MicroInstance}
```

```javascript
// @example
microApp.register()
```

### .resetFetchingMode ()

重置子应用加载模式为当前环境下的默认状态。

```bash
@returns {MicroInstance}
```

```javascript
// @example
microApp.resetFetchingMode()
```

### .share (globalName, exposed)

主应用向 `window` 对象下挂载通用对象，供子应用使用。

```bash
@param {string} globalName
@param {Object} exposed
@returns {MicroInstance}
```

```javascript
// @example 主应用
import Vue from 'vue'
microApp.share('MicroMain', {Vue: Vue})
// @example 子应用
console.log(MicroMain.Vue)
```

### .start ()

启动应用。

```bash
@returns {MicroInstance}
```

```javascript
// @example
microApp.start()
```
