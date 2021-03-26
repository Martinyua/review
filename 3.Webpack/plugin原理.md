https://juejin.cn/post/6844904070868631560#heading-2

https://segmentfault.com/a/1190000038338386

### loader原理

每个 Webpack 的 Loader 都需要**导出一个函数**，这个函数就是我们这个 Loader 对资源的处理过程，它的输入就是加载到的资源文件内容，输出就是我们加工后的结果。我们通过 source 参数接收输入，通过返回值输出。

**刚刚讲到的是loader的执行顺序是从右到左，从下到上。而loader的加载顺序**还是我们所理解的从左到右，从上到下

### `Tabable`

webpack本质是一种事件流的机制。webpack的事件流基于Tabable。Tabable有点类似nodejs的events库。核心也是发布订阅模式。Tabable提供了很多类型的钩子。

Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件

### 插件原理

* 首先plugin是一个独立的模块。
* 模块暴露一个js函数
* 在这个函数的prototype上定义一个注入了compiler对象的apply方法
* apply函数中要有通过compiler对象挂载的`webpack`事件钩子。钩子的回调中能搞拿到当前编译的compilation对象。如果是异步插件可以拿到回调callback
* 通过自定义的子流程处理compilation对象的数据。如果是异步插件，数据处理完后执行callback回调
* webpack在不同执行时机会触发各种钩子事件

```js
class HelloPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数，用于特定时机处理额外的逻辑；
    compiler.hooks.emit.tap('HelloPlugin', (compilation) => {
      // 在功能流程完成后可以调用 webpack 提供的回调函数；
    })
    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，
    compiler.plugin('emit', function (compilation, callback) {
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一直卡在这不往下执行
      callback()
    })
  }
}

module.exports = HelloPlugin
```



一个去注释插件

1. 通过 `compiler.hooks.emit.tap()` 来触发生成文件后的钩子
2. 通过 `compilation.assets` 拿到生产后的文件，然后去遍历各个文件
3. 通过 `.source()` 获取构建产物的文本，然后用正则去 replace 调注释的代码
4. 更新构建产物对象
5. 执行回调，让 webpack 继续执行

```js
class RemoveCommentPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // 去除注释正则
    const reg = /("([^"]*(.)?)*")|('([^']*(.)?)*')|(/{2,}.*?(r|n))|(/*(n|.)*?*/)|(/******/)/g

    compiler.hooks.emit.tap('RemoveComment', (compilation) => {
      // 遍历构建产物，.assets中包含构建产物的文件名
      Object.keys(compilation.assets).forEach((item) => {
        // .source()是获取构建产物的文本
        let content = compilation.assets[item].source()
        content = content.replace(reg, function (word) {
          // 去除注释后的文本
          return /^/{2,}/.test(word) || /^/*!/.test(word) || /^/*{3,}//.test(word) ? '' : word
        })
        // 更新构建产物对象
        compilation.assets[item] = {
          source: () => content,
          size: () => content.length,
        }
      })
    })
  }
}

module.exports = RemoveCommentPlugin
```

