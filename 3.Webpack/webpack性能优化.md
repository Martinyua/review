### 构建提速

#### loader

不要让loader做太多事情。

以babel-loader为例：

配置rules可以用exclude字段来避免不必要的转义，比如node_modules

#### DLL

这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。**这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包**。如react或者vue这种很大的依赖包

如果使用了DLLPlugin处理文件，打包会分为两步走

* 基于**dll专属的配置文件**，打包dll库
* 基于webpack.config.js，打包业务代码

使用dll插件需要专属的dll配置文件。打包出来后有两个文件一个是vendor.js一个是vendor-manifest.json。这个多出来的就是第三方库对应的具体路径。

再在webpack.config.js中对dll做一些配置

```js
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest就是我们第一步中打包出来的json文件
      manifest: require('./dist/vendor-manifest.json'),
    })
  ]
```

#### Happypack

开启多进程打包

```
  plugins: [
    ...
    new HappyPack({
      // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
      id: 'happyBabel',
      // 指定进程池
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory']
    })
  ],
```

#### Tree-Shaking

**是基于 import/export 语法，Tree-Shaking 可以在编译的过程中获悉哪些模块并没有真正被使用，这些没用的代码，在最后打包的时候会被去除。**



#### UglifyJsPlugin

在 webpack4 中，我们是通过配置 optimization.minimize 与 optimization.minimizer 来自定义压缩相关的操作的。

#### terserwebpackplugin

来替代UglifyJsPlugin。因为UglifyJsPlugin不支持ES6语法的压缩



### Code Split

* 通过配置多个入口`entry`文件

* SplitChunks来实现

  * ```
    optimization: {
        splitChunks: {
          chunks: "all",
      },
    ```

  * 打包后的dist

    * 打包后出来的三个page
    * 还有一个vendors_[hash].bundle.js(**此文件中保存了pageA、pageB、pageC和node_modules中共有的size大于30KB的文件**）

  * 事实上这全靠了配置中本身默认固有一个cacheGroups的配置项。

  * 会将 node_mudules 文件夹中的模块打包进一个叫 vendors的bundle中，

    * vendors的内容

      * 会将 node_mudules 文件夹中的模块打包进一个叫 vendors的bundle中，
      * 所有引用超过两次的模块分配到 default bundle 中 更可以通过 priority 来设置优先级。

      参数说明如下：

      * chunks：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
      * minSize：**表示抽取出来的文件在压缩前的最小大小，默认为 30000**；
      * maxSize：表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
      * minChunks：**表示被引用次数，默认为1**；上述配置commons中minChunks为2，表示将被多次引用的代码