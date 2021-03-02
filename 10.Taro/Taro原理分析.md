### 设计思想

>  在 Taro 中采用的是编译原理的思想，所谓编译原理，就是一个对输入的源代码进行**语法分析**，**语法树构建**，随后对语法树进行**转换操作再解析生成目标代码**的过程。

![img](https://user-gold-cdn.xitu.io/2018/10/8/1665182480dfc020?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

可以看出小程序和 Web 端上组件标准与 API 标准有很大差异,`Taro` 采用了定制一套运行时标准来抹平不同平台之间的差异。这一套标准主要以三个部分组成，包括**标准运行时框架**、**标准基础组件库**、**标准端能力 API**，其中运行时框架和 API 对应 `@taro/taro`，组件库对应 `@tarojs/components`，通过在不同端实现这些标准，从而达到去差异化的目的



![img](https://user-gold-cdn.xitu.io/2018/10/8/16651824884a5682?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

​	taro采用了微信小程序的组件库和API来作为Taro运行时的标准

![img](https://user-gold-cdn.xitu.io/2018/10/8/16651824b8ac59a4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 编译工作流与抽象语法树（AST）

> Taro 的核心部分就是将代码编译成其他端（H5、小程序、React Native 等）代码。一般来说，将一种结构化语言的代码编译成另一种类似的结构化语言的代码包括以下几个步骤

![img](https://user-gold-cdn.xitu.io/2018/10/8/166515483b7fa7c0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

首先是 `Parse`，将代码**解析**（`Parse`）成**抽象语法树**，然后对 AST 进行**遍历（traverse）和替换(replace)**（这对于前端来说其实并不陌生，可以类比 DOM 树的操作），最后是**生成**（`generate`），根据新的 AST 生成编译后的代码

### Babel模块

Babel 是一个通用的多功能的 `JavaScript`编译器，更确切地说是源码到源码的编译器，通常也叫做转换编译器（`transpiler`）。

Taro使用到的有Babel的模块有

* `Babylon - Babel` 的解析器
* `Babel-traverse` - **负责维护整棵树的状态**，并且负责替换、移除和添加节点

* `Babel-types` - 一个用于 AST 节点的 `Lodash` 式工具库， 它包含了构造、验证以及变换 AST 节点的方法。
* `Babel-generator - Babel` 的代码生成器，它读取 AST 并将**其转换为代码**和**源码映射**（`sourcemaps`）。

* `Babel-template` - 它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成大规模 AST 的时候。 在计算机科学中，这种能力被称为准引用（`quasiquotes`）。

总结：利用babel的一些模块来实现了**源码到源码的转换**，过程包括了，对语法树的**分析和维护，变换**。以及AST转换为代码，的功能模块





### Taro运行时

### 运行时

createComponent 方法主要做了这样几件事情：

* 将组件的 state 转换成小程序组件配置对象的 data

* 将组件的生命周期对应到小程序组件的生命周期

* 将组件的事件处理函数对应到小程序的事件处理函数

**`BaseComponent` **大概的 UML 图如下，主要是对 React 的一些核心方法：`setState`、`forceUpdate` 等进行了替换和重写，结合前面编译后 render 方法被替换，大家不难猜出：Taro 当前架构只是在开发时遵循了 React 的语法，在代码编译之后实际运行时，和 React 并没有关系。