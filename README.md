# micro-core

## 简介

`micro-core` 是基于 [`single-spa`](https://single-spa.js.org/) 和
[`qiankun`](https://qiankun.umijs.org/)封装的，应用于前端微服务架构的核心类库。致力于解决
单页面微前端架构下应用的加载、启动、调度问题，同时提供了必要的辅助方法，便于对应用间的数据进行共享、
查找，处理多例子应用共存等普遍场景。

`single-spa` 和 `qiankun` 对微前端应用的管理包含了诸多概念及方法，`micro-core` 存在的目的除
了提供一个快速开始搭建前端微服务架构的方式外，也在于对二者的概念和方法进行整合，使真实项目开发的多数
场景得到快捷、有效的支持。

## 安装

首先，请确保项目中已安装 `qiankun` 及 `single-spa`, 具体的安装方式请参考简介中官网的介绍。

为了便于此类库迭代初期的升级维护，暂不将此类库作为npm包进行发布。

目前，对此类库的使用，可直接clone此repo的main分支源码于项目目录下，建议将源码放置于 `src/libs` 目录下。
目录结构应类似于：

``` bash
- src
  - libs
    - micro-core
```

## 引用

基于webpack、rollup等打包工具的基础上，对此类库的应用可使用如下方式：

1. 配置了目录别名。如：`src` 目录别名配置为 `@`

```javascript
import micro from '@/libs/micro-core'
```

2. 未配置目录别名。此情况需使用文件相对路径方式引入。

```javascript
import micro from '<relative_path>/libs/micro-core'
```

## 注册应用

从应用类型的角度来看，微前端架构的基本组成分为主应用和子应用。主应用的作用是对子应用进行调度，通常情
况下，主应用只有一个。子应用是对一个项目而言，各个功能、业务模块的最大拆分粒度，在主应用的调度下，与
主应用一同组成一个完整的可被访问的前端应用。

理想情况下，应用应支持分布式开发、部署，这样可以确保各个应用开发团队在团队管理和技术选型上最大程度的
独立，也能保证各个应用的更新、发布不受制于其他应用的实施情况，主应用随时可以通过异步fetch的方式加载
子应用。

在投入开发之前，主应用团队应对各个子应用团队的应用名称、开发期间端口、顶级模块路径划分做出统一规划，
确保应用名称、开发端口和顶级模块路径不冲突。

### 创建主应用实例

首先，我们需要创建一个微前端应用实例，准确地说，是创建一个主应用实例，因为在微前端架构下，子应用的调
度是通过主应用实现的。

```javascript
import micro from '@/libs/micro-core'
let microApp = micro({name: 'MicroMain', env: 'main_development'})
```

在上面的代码中，通过调用micro构造函数，创建了一个名称为 `MicroMain` 的主应用，同时指定了当前程序
的执行环境为主应用开发环境，在此环境下，主应用默认将从子应用配置的remote entry加载资源。关于`env`
参数的其他可选值及对子应用加载方式的影响请查看[api文档](https://github.com/micro-frontends-lab/micro-core/blob/main/doc/api.md)。

### 主应用注册子应用

注册应用的目的是将需要被调度的子应用入口注册到主应用，以便在恰当的时机对子应用资源进行加载、启动、调度。
示例如下：

```javascript
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

在上方示例中，我们在主应用中注册了两个子应用。应用名分别是 `MicroChildOne`, `MicroChildTwo`。
应用名是区分应用的标识，是必须且唯一的，命名规则建议使用驼峰命名法，不能包括空格，最好也不要包括特殊
字符。

注册子应用时，可向子应用传入静态 `props` 字段，`props` 将作为子应用调度入口函数执行的参数，以便
于主应用向子应用下发数据。一个需要注意的地方是，`micro-core` 为了方便子应用的挂载，默认会在
`props` 中添加 `root` 字段，该字段为 `Object` 结构，可通过访问其 `el` 属性获取一个
`HTMLElement`, 该元素可用来挂载子应用。便于主应用对挂载后的子应用进行布局。除了 `root` 字段外，
`micro-core` 对 `props` 添加了另一个默认为 `true` 的字段 `cachable`, 主要用来告知子应用是
否应缓存已被激活过的路由，子应用须正确相应此字段。

主应用对子应用静态资源的获取，采用的是异步 `fetch` 的方式，会有跨域的问题，此问题可通过对子应用部署
服务开启跨域支持，或在主应用部署服务上使用反向代理的方式解决。

### 子应用的入口文件

上方示例中子应用的入口，我们配置了两个地址，这两个地址返回的mime类型为 `text/html`，这样做的目的
是为了简化主应用对子应用入口的配置，同时，便于独立部署的子应用对静态资源的缓存控制。理论上，子应用的
入口也可配置成应用静态资源数组或对象的形式，但并不建议，原因如前所述。

对于spa架构的子应用而言，其入口 `html` 文件中通常包括子应用需要加载的 `javascript` 文件, 其中
最后一个或带有 `entry` 属性的 `javascript` 文件将被视为调度该子应用的入口，该文件中需要导出三个
异步函数：

- `bootstrap`

  第一次加载完成子应用时调用，通常用来初始化子应用的运行时环境。例：

  ```javascript
  export async function bootstrap (props) {
      console.log('MicroChildOne bootstraped!')
  }
  ```

- `mount`

  每次子应用需要被激活时调用，用来向主应用挂在子应用。例：

  ```javascript
  let instance = null
  export async function mount (props) {
      instance = new Vue(...).$mount(props.root.el)
      console.log('MicroChildOne mounted!')
  }
  ```

- `unmount`

  每次子应用需要被卸载时调用，用来释放子应用运行期间产生的内存等。例：

  ```javascript
  export async function unmount (props) {
      instance.destroy()
      props.root.el.innerHTML = ''
      console.log('MicroChildOne unmounted!')
  }
  ```

对于编码上的要求，以上三个函数即为一个待注册子应用需要准备的全部内容。除了编码上的要求外，子应用在打
包上也有相应的要求。

- 静态资源根路径的配置

  为了确保子应用资源加载路径的正确，子应用须在打包时配置静态资源根路径。以webpack配置 `publicPath`
  为例：

  ```javascript
  process.env.NODE_ENV === 'development' ? `http://localhost:8081/` : `/MicroChildOneAssets/`,
  ```

- 模块输出的配置

  为了确保子应用被主应用正确识别、调度，子应用须在打包时配置 `jsonp` 回调名称，`jsonp` 中包含的
  包名应与子应用在主应用中注册的名称相同。以webpack配置 `output` 为例：

  ```javascript
  output: {
    library: 'MicroChildOne-[name]',
    libraryTarget: 'umd',
    jsonpFunction: 'webpackJsonp_MicroChildOne'
  }
  ```

## 注册应用模块

注册应用模块的目的有两个，一是为了自动生成子应用各个顶级模块的路由路径以便于主应用在路由变化至某一路
径时，激活相应的子应用，另一个目的是为了提供一种在不同技术栈中对子应用路由统一的管理方式，避免重复的
手动设置工作。对于应用模块的命名规则与应用名称的命名规则一致。

应用模块类型包括各个子应用的顶级模块即不同的顶级模块所包含的子级模块。对于主应用而言，只需管理各个子
应用的顶级模块入口，子级模块由各个子应用自行管理。一个形象的例子是在一个后台管理项目中，主应用需要在
菜单中配置子应用的路由链接，当用户点击菜单中的一个链接后，便跳转到相应子应用中，当用户在子应用中对业
务进行操作时，仍有可能产生子应用页面的跳转。那么我们可以把用户刚进入子应用进行操作的那个模块认为是顶
级模块，跳转后的模块为子级模块。

对于当前视图只激活单一子应用的某个模块的场景，我们称之为单例模式，相反的，对于当前视图同时激活多个子
应用的场景，我们称之为多例模式。`micro-core` 支持这两种模式下应用模块的注册，并且采用约定大于配置
的方式对子应用各个顶级模块的路由匹配规则自动生成。

生成规则为：

- 单例模式

  ```
  /<AppName>/<ModuleName>
  ```

- 多例模式

  ```
  /<AppName1>-<AppName2>/<ModuleName>
  ```

需要注意的是，如果在模块注册过程中对某一模块添加了 `path` 字段，则以 `path` 为准，以上自动生成规
则不适用。

具体的注册方式如下(承接上方注册应用代码)：

```javascript
microApp.modules(
    micro.singletonModules('MicroChildOne',
        {
            name: 'Customer',
            title: '客户管理',
            auth: ['admin']
        }, {
            name: 'Storage',
            title: '库存管理',
            auth: ['admin', 'op']
        }
    ),
    micro.singletonModules('MicroChildTwo',
        {
            name: 'Order',
            title: '订单管理',
            auth: ['admin', 'sales']
        }
    ),
    micro.multitionModules(['MicroChildOne', 'MicroChildTwo'],
        {
            name: 'Dashboard',
            title: '工作台',
            path: '/dashboard'
        }
    )
)
```

在上方示例中，通过调用 `modules` 方法对应用模块进行注册，其中 `micro.singletonModules` 方法
为两个子应用生成了相应的单例模块数据，该方法的第一个参数为子应用名称，其余参数为需要注册的各个模块的
配置。通过 `micro.multitionModules` 方法，我们生成了一个多例模块数据对象，该模块路由在被激活时，
会同时激活两个子应用，需要被激活的子应用以数组的形式传递到该方法的第一个参数中。

另外，在定义应用模块中，我们添加了两个自定义字段 `auth` 和 `title`，事实上，除了 `name` 和
`path` 被用作 `micro-core` 应用模块路由的生成规则外，你可以添加任意的自定义字段，以便于后期通过
 `findModule` 方法获取到模块时使用，你可以通过 `findModule` 或 `findModules` 方法查询到应
 用模块，以便以相应的规则映射到主应用的路由系统配置中。

## 启动应用

在 `micro-core`中注册应用，相当于编程中对方法的定义，还没有开始调用定义的方法，也就是说，目前为止
我们只是定义了一系列子应用，并没有开始启动它们，最后我们要做的就是启动应用。这样，在路由变化时，匹配
的应用就会被激活。示例如下：

```javascript
microApp.register().start()
```

## 常见问题

1. `micro-core` 是否对主应用技术栈有要求？

  没有要求，`micro-core` 是类库，对项目的侵入性很小，本身只是对微前端架构项目提供了一种应用管理的
  方式，并不限制技术栈的选择。

2. 应用间是否应该共享技术栈？

  这是一个场景化的问题。从理想的角度看，微前端架构的一大优势就是可以不受制于技术栈的影响，更大限度地
  给各个团队独立开发、部署的自由，也可以更大程度延长一个固有项目的可维护周期。但如果你的团队技术栈比
  较统一，那么在不同的团队中重复开发类似的功能或引入相同的资源，无疑也是对生产力和性能上的一种浪费，
  在这种情况下共享部分技术栈可能是更好的选择，但同时也要预料到由于共享所产生的团队管理与技术依赖上的
  耦合问题。总而言之，一切在于一个平衡点的选择。

3. 应用间的隔离如何处理？

  对于 `single-spa` 和 `qiankun` 而言，并不存在真实有效的应用硬隔离机制，所以，我们不得不采取
  软隔离的方式，对应用间共享的空间，如全局变量名称、localStorage、cookie、事件名称、dom节点
  class、id等采取添加前缀或约定命名空间的方式进行隔离。对于css的隔离，可以借助类似
  [postcss-prefixwrap](https://www.npmjs.com/package/postcss-prefixwrap) 的工具添
  加前缀。对于js命名空间的管理可使用约定全局顶级变量名的方式。

4. 应用间如何通信？

  推荐使用 `micro-messenger` 库处理应用间的通信。

5. 主应用如何暴漏出可共享的框架、类库供子应用使用？

  通过调用 `share` 方法（详见[api文档](https://github.com/micro-frontends-lab/micro-core/blob/main/doc/api.md))，
  主应用可暴漏出需共享的内容到 `window` 对象下，需要使用的子应用可以在打包的时候配置 `externals`,
  或直接引用主应用暴漏到 `window` 下的顶级全局变量。

6. 主应用如何像子应用传递动态变化的props？

  可一使用 `dynamicProps` 方法， 详见api文档。

## 更多内容

更多内容请参考 [`doc/api.md` 文档](https://github.com/micro-frontends-lab/micro-core/blob/main/doc/api.md)。
