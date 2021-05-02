### 概念 

> 本质上，*webpack* 是一个现代 JavaScript 应用程序的*静态模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图(dependency graph)*，其中包含应用程序需要的每个**模块**，然后将所有这些模块打包成一个或多个 ***bundle***。



#### 核心概念

* mode

  * 提供mode配置选项，告知webpack使用相应的内置优化

  * 有`development`和`production`

    ```js
    module.exports = {
      mode: 'production',
    }
    ```

* 入口(entry)

  * 入口起点(entry point)**入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。**（从它开始解析依赖，一个或多个）

    ```js
    module.exports = {
      entry: './path/to/my/entry/file.js',
    }
    //多个入口
    module.exports = {
            entry: {
                main: './src/index.js'
            }
        }
    ```

    

* 出口(output)

  * output 属性告诉 webpack **在哪里输出它所创建的 bundles**，以及如何命名这些文件，默认值为 ./dist。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。

    ```js
    const path = require('path')
    
    module.exports = {
      entry: './path/to/my/entry/file.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
      },
    }
    ```

    

* loader

  * 让 webpack 能够去**处理**那些**非 JavaScript 文件**（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。--（一种处理多种文件格式的机制，可以理解为一个**转换器**，负责把某个文件格式的内容转换成webpack可以支持的打包模块）

  * 在module.rules下配置相关规则

    ```
    module.exports = {
      module: {
        rules: [
          { test: /\.css$/, use: 'css-loader' },
          { test: /\.ts$/, use: 'ts-loader' },
        ],
      },
    }
    ```

    

* plugin

  * loader 被用于转换某些类型的模块，**而插件则可以用于执行范围更广的任务。**插件的范围包括，**从打包优化和压缩，一直到重新定义环境中的变量。**插件接口功能极其强大，可以用来处理各种各样的任务。

  * 想要使用一个插件，**你只需要 require() 它，然后把它添加到 plugins 数组中。**多数插件可以通过**选项(option)自定义**。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过 npm 安装
    const webpack = require('webpack') // 用于访问内置插件
    
    const config = {
      module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' }],
      },
      plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
    }
    
    module.exports = config
    ```

    

### 基本loader

注意loader的执行顺序是**从后往前**

1. post-css（浏览器兼容，自动添加css前缀），style-loader（把css代码注入到JS中，通过DOM操作来加载css）,css-loader（加载CSS，支持模块化，压缩，文件导入）
2. file-loader,把文件输出到一个文件夹中，**在代码中通过相对URL去引用输出的文件**
3. image-loader,加载并且压缩图片文件
4. url-loader(优化)
5. babel-loader(相关配置在babelrc)把 ES6 转换成 ES5
6. source-map-loader：加载额外的 `Source Map` 文件，以方便断点调试
7. ts-loader



### 打包优化（提高性能和体验）

* production下，自带：tree-shaking，scope hoisting

* CSS：Mini-css-extract-plugin(提取抽离css),optimize-css-assest-webpack-plugin(css压缩)

* JS优化：

  * **代码分离（code splitting）**

    >  code splitting 是webpack打包时用到的重要的优化特性之一、此特性能够把代码分离到不同的bundle中，然后可以按需加载或者并行加载这些文件，代码分离可以用于获取更小的bundle，以及控制资源加载优先级，如果能够合理的使用能够极大影响加载时间

  * **手动配置多个入口**

  * **抽离公共代码**：使用`splitChunksPlugin`去重和分离`chunk`

  * **动态导入**，用到那个模块才会加载那个模块，通import来动态导入，但需要babel支持

  * `noParse` 。在引入一些第三方模块时（如jq)，我们知道他肯定不会引用其他的依赖模块。所以不需要webpack花费时间去解析他的内部依赖

  * `IgnorePlugin`。在引入一些第三方模块时，例如momentJS、dayJS，会有很多语言包，会占用很多空间，**所以可以忽略所有语言包**，然后再按需引入，使构建效率更高

  * **压缩代码**。删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的`UglifyJsPlugin`和`ParallelUglifyPlugin`来压缩JS文件

  * 删除死代码（**Tree Shaking**）。将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数`--optimize-minimize`来实现

  * 利用**CDN加速**

    利用 CDN 加速。在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径。可以利用 webpack 对于 `output` 参数和各 loader 的 `publicPath` 参数来修改资源路径

### 构建速度优化

* 多入口情况下，使用`SplitChunksPlugin `来提取公共代码
* 利用`DllPlugin`和`DllReferencePlugin`预编译资源模块 通过`DllPlugin`来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过`DllReferencePlugin`将预编译的模块加载进来。
* 使用`Happypack` 实现**多进程**加速编译
* 使用`webpack-uglify-parallel`来提升`uglifyPlugin`的压缩速度。 原理上`webpack-uglify-parallel`采用了多核并行压缩来提升压缩速度
* 使用`Tree-shaking`和`Scope Hoisting`来剔除多余代码
* thread-loader也可以多线程打包



#### SplitChunksPlugin

webpack将根据以下条件自动拆分代码块：

- 会被共享的代码块或者 `node_mudules` 文件夹中的代码块

- 体积大于30KB的代码块（在gz压缩前）

- 按需加载代码块时的并行请求数量不超过5个

- 加载初始页面时的并行请求数量不超过3个

- chunks： chunk理解为“代码块”，例如node_module下的module，或者你自己import入页面的自定义js。

  chunks属性用来选择分割哪些代码块，可选值有：'all'（所有代码块），'async'（按需加载的代码块），'initial'（初始化代码块）。

-  bundle理解则可理解为已打包好的代码包，而代码包就是由很多chunk组成的了



#### Tree shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)为了学会使用 tree shaking，你必须……

- 使用 ES2015 模块语法（即 import 和 export）。
- 在项目 package.json 文件中，添加一个 "sideEffects" 入口。
- 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。 你可以将应用程序想象成一棵树。绿色表示实际用到的源码和 library，是树上活的树叶。灰色表示无用的代码，是秋天树上枯萎的树叶。为了除去死去的树叶，你必须摇动这棵树，使它们落下。

### HMR热更新

模块热替换(HMR - Hot Module Replacement)功能会**在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。**主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面时丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式

#### 热更新原理

> **大概流程是我们用webpack-dev-server启动一个服务之后，浏览器和服务端是通过websocket进行长连接，**
>
> **webpack内部实现的watch就会监听文件修改，只要有修改就webpack会重新打包编译到内存中，然后webpack-dev-server依赖中间件webpack-dev-middleware和webpack之间进行交互，**
>
> **每次热更新都会请求一个携带hash值的json文件和一个js，websocket传递的也是hash值，内部机制通过hash值检查进行热更新，如果这些模块无法更新，则会刷新页面 至于内部原理，因为水平限制，目前还看不懂。客户端的websocket监听到有文件改动推送过来的hash戳，会和上一次对比一致则走缓存不一致则通过ajax和jsonp向服务端获取最新资源
> 使用内存文件系统去替换有修改的内容实现局部刷新**



初始化：从配置文件读取与合并参数，然后实例化插件`new Plugin()`

开始编译：通过上一步获取的参数，初始化一个`Complier`对象加载插件，执行`Compiler.run`开始编译

确定入口：根据配置中`entry`找出所有入口文件

编译模块：从`entry`出发，调用配置的`loader`，对模块进行转换，同时找出模块依赖的模块，一直递归，一直到找到所有依赖的模块

完成模块编译：这一步已经使用`loader`对所有模块进行了转换，得到了转换后的新内容以及依赖关系

输出资源：根据入口与模块之间的依赖关系，组装成`chunk`代码块，生成文件输出列表

输出成功：根据配置中的输出路径还有文件名，把文件写入系统，完成构建





### ES6 Module和Commonjs的区别

* ES6Module是静态引入，即编译时引入
* Commonjs为动态引入，即执行时引入
* webpack代码打包时代码还未执行，所有只有Module才能静态解析，实现Tree-Shaking

### 打包流程

webpack打包流程是一个串行的过程：
	1. 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的参数
	2. 开始编译，根据参数初始化编译程序对象，加载配置的插件，执行编译程序对象的run开始编译
	3. 确定入口，根据配置的entry找出所有的入口文件
	4. 编译模块，从入口文件出发，调用所有配置的loader对模块进行翻译，如果模块中有模块，那么回递归查找模块并进行处理，直到所有入口文件处理完毕。
	5. 完成模块编译，通过上一步得到每一个模块的最终内容以及相应的依赖关系
	6. 输出资源，根据入口文件和模块之间的依赖关系，组装成一个个包含多个模块chunk，把每个chunk转换成单独文件加入到输出列表，这是最后一次可以修改输	出内容的机会
	7. 输出完成，根据配置的路径和文件名把文件内容写入到文件系统



### 参考，更多

[webpack常见面试题](https://juejin.cn/post/6844903877771264013#heading-9)

https://juejin.cn/post/6844904070868631560#heading-2