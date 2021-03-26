### 设计思想

>  在 Taro 中采用的是编译原理的思想，所谓编译原理，就是一个对输入的源代码进行**语法分析**，**语法树构建**，随后对语法树进行**转换操作再解析生成目标代码**的过程。

![img](https://user-gold-cdn.xitu.io/2018/10/8/1665182480dfc020?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Taro1，2编译时和运行时

当前架构主要分为**编译时和运行时**

* 其中**编译时**主要是将 Taro 代码通过 **Babel**[11] 转换成 小程序的代码，如：`JS`、`WXML`、`WXSS`、`JSON`。通过静态编译转换为小程序的模板文件

* **运行时**主要是进行一些：生命周期、事件、data 等部分的处理和对接。

#### 编译时

使用 **babel-parser**[12] 将 Taro 代码解析成抽象语法树，然后通过 **babel-types**[13] 对抽象语法树进行一系列修改、转换操作，最后再通过 **babel-generate**[14] 生成对应的目标代码。整个编译过程最复杂点的就是在JSX(j比如if else，map,&&等 都要转为小程序的规则)。编译后没有了**render方法**

```js
// 编译后
import {BaseComponent, createComponent} from '@tarojs/taro-weapp'

class Index extends BaseComponent {

// ...

  _createDate(){
    //process state and props
  }
}

export default createComponent(Index)
```



#### 运行时

运行时辅以轻量级的JS代码，磨平React与小程序的一些差别

**BaseComponent 和 createComponent**

编译后的代码，没有了render方法。但是增加了`BaseComponent`和`createComponent`。

* `BaseComponent`对一些react核心代码（如setState，constructor，forceUpdate）等进行了重写和替换。
* `createComponent` 主要作用是调用 **`Component()`** 构建页面；对接事件、生命周期等；进行 `Diff Data` 并调用 `setData` 方法更新数据。



**总结一下**：当前taro版本(1,2)是重编译，轻运行。编译时主要用到了babel模块将Taro语法转换成了抽象语法树。运行时主要用到了`BaseComponent`对react核心代码进行替换和`createComponent`来调用Component()方法构建页面对接，对接事件，生命周期。调用setData。Taro只是开发时遵循了React规则，编译后的代码与React无关

### 为什么为编译时。

Taro最初出于**性能考虑**。同等情况下，编译时做的工作多，运行时做的工作也就越少，性能会更好。重编译也保证代码在编译后的**可读性**。

比如一个条件语句中不能写很多return，需要遵循小程序开发规范，一个文件中定义一个组件类。区别于编译时方案，运行时方案侧重在运行时实现渲染能力，不依赖静态编译，因此几乎没有语法限制，这也是其最大的特点。

总结：

* 编译时的优点：
  * 运行时的性能更好
  * 编译后的代码有较好的可读性
* 编译时的缺点：
  * 语法约束高,受React的限制，没有灵活性和适配性





### Taro3

基于运行时。动态构建模板

>  牺牲性能换取来换取框架更大的灵活性和适配性。页面需要大量的监听器，并且将TaroDOMTree通过data渲染到view会耗费大量的性能

由于无论是React还是。taro通过taro-runtime的包，实现了一套高效的，精简的DOM/BOM API。然后通过webpack的ProvidePlugin，注入到了小程序的逻辑层。使得react可以直接在小程序上运行。但是由于react-dom中 做了大量的浏览器兼容处理，会导致包很大。然后taro就做了react-taro来连接react-reconciler和taro-runtime。

然后React就可以直接在小程序上运行了。然后生成Taro DOM Tree。

**运行时的原理：**Taro DOM Tree**渲染**的问题？首先先对所有组件模板化处理，生成小程序对应的模板。先去遍历根节点的子元素，再根据每个子元素的类型选择对应的模板来渲染子元素，然后在每个模板中我们又会去遍历当前元素的子元素，以此把整个节点树递归遍历出来。

先生成小程序模板template -> 遍历根节点的子元素 ->选择对应的模板来渲染子元素 -> 在每个模板会递归遍历当前元素的子元素

小程序屏蔽了DOM/BOM。所以先构建一个Vnode。然后将这个Vnode转换为小程序对应的模板。然后更加子元素的类型选择对应的模板来渲染子元素。

小程序的自引用：小程序的自定义组件具有的『自引用』特性为动态创建 DOM 打开了突破口。所谓自引用，就是自定义组件支持使用自己作为子节点，也就意味着通过递归引用的方式，我们能够构造任意层级和数量的 DOM 树。

解决的问题：

* 更加灵活，无环境现在，react，vue都可以进行开发
* 由于相当于React和Vue直接运行在小程序上，所以对于新特性支持比较好
* 模板动态创建：相比以前静态编译创建模板，Taro3基于组件的template，动态递归遍历每一个template渲染整个DOM树
* 以前是基于babel，所以对工程化支持不是很好。现在是基于webpack实现了多端的工程化，可以提供各种插件功能

[Taro3揭秘](https://mp.weixin.qq.com/s?__biz=MzU3NDkzMTI3MA==&mid=2247483770&idx=1&sn=ba2cdea5256e1c4e7bb513aa4c837834)

[运行时的原理](https://remaxjs.org/guide/implementation-notes)

### 运行时 带来的问题

一般小程序是看不出来，但是我们小程序因为业务逻辑复杂，所以非常的明显。表现就是

列表渲染卡顿，没办法大量的dom大量的setData操作肯定卡炸。所以只能用原生组件解决，但这种方法确实鸡肋

而且内存占用升高，慢慢升高还好，但是在小程序如果一瞬间超过50%内存占用的话，小程序就直接闪退了，影响非常大
上面的优化方案kbone也做了一些，但现实效果不太明显。

所以现在也没找到什么好的方案，编译时的方案限制实在太多了，写起来非常不舒服，同时对不同端优化起来也很麻烦，而且技术很难迭代。

运行时则牺牲了性能，对用户影响更大。















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

`createComponent` 方法主要做了这样几件事情：

* 将组件的 state 转换成小程序组件配置对象的 data

* 将组件的生命周期对应到小程序组件的生命周期

* 将组件的事件处理函数对应到小程序的事件处理函数

**`BaseComponent` **大概的 UML 图如下，主要是对 React 的一些核心方法：`setState`、`forceUpdate` 等进行了替换和重写，结合前面编译后 render 方法被替换，大家不难猜出：Taro 当前架构只是在开发时遵循了 React 的语法，在代码编译之后实际运行时，和 React 并没有关系。





