## React 15的生命周期

![1.png](https://s0.lgstatic.com/i/image/M00/5E/31/Ciqc1F-GZbGAGNcBAAE775qohj8453.png)

### Mounting阶段：组件的初始化渲染（挂载）

挂载过程在组件的一生中仅会发生一次，在这个过程中，组件被初始化，然后会被渲染到真实 DOM 里，完成所谓的“首次渲染”。

* constructor方法，仅在挂载时被调用一次，可以在该方法内对 this.state 进行初始化。
* componentWillMount 在执行 render 方法前被触发
* render 在执行过程中并不会去操作真实DOM，它的职能是**把需要渲染的内容返回出来**。
* componentDidMount 在渲染结束后被触发，此时真实DOM已经挂载到了页面上，可以在这个生命周期里执行真实DOM相关操作。此外，类似于异步请求、数据初始化这样的操作也可放在其中来做。

### Updating阶段：组件的更新

组件的更新分为两种：一种是由父组件更新触发的更新；另一种是组件自身调用自己的 setState 触发的更新。

* **componentWillReceiveProps** 并不是由 props 的变化触发的，而是由父组件的更新触发的。**如果父组件导致组件重新渲染，即使props没有更改，也会调用此方法。如果只想处理更改，请确保进行当前值与变更值的比较。**

  ```js
  componentWillReceiveProps(nextProps)
  ```

  在这个生命周期方法里，nextProps 表示的是接收到新 props 内容，而现有的 props （相对于 nextProps 的“旧 props”）我们可以通过 this.props 拿到，由此便能够感知到 props 的变化。

* componentWillUpdate 会在 render 前被触发，允许在里面做一些不涉及真实 DOM 操作的准备工作；

* componentDidUpdate 则在组件更新完毕后被触发，这个生命周期也经常被用来处理 DOM 操作。此外，我们也常常将 componentDidUpdate 的执行作为子组件更新完毕的标志通知到父组件。

* **shouldComponentUpdate**

  ```js
  shouldComponentUpdate(nextProps, nextState)
  ```

  render 方法由于伴随着对虚拟 DOM 的构建和对比，过程可以说相当耗时。而在 React 当中，很多时候我们会不经意间就频繁地调用了 render。为了避免不必要的 render 操作带来的性能开销，React 为我们提供了 shouldComponentUpdate 这个口子。

  React 组件会根据 shouldComponentUpdate 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行**re-render**（重渲染）。shouldComponentUpdate 的默认值为 true，也就是说“无条件 re-render”。在实际的开发中，我们往往通过手动往 shouldComponentUpdate 中填充判定逻辑，或者直接在项目中引入 PureComponent 等最佳实践，来实现“有条件的 re-render”。

### Unmounting阶段：组件的卸载

如何触发？

* 组件在父组件中被移除了
* 组件中设置了key属性，父组件在render过程中，发现key值和上次不一致，那么组件就会被干掉

## React 16的生命周期

[这里](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)可以看工作流程图。

**React 16.3的大图**

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/5D/D9/CgqCHl-FVVeAaMJvAAKXOyLlUwM592.png)

### Mounting阶段：组件的初始化渲染（挂载）

与React 15相比，**废除了componentWillMount，新增了getDerivedStateFromProps**。同时，React 16的render方法允许我们返回元素数组和字符串，而React 15的render方法必须返回单个元素。

getDerivedStateFromProps这个API的设计初衷并非试图替换componentWillMount，而是试图替换 componentWillReceiveProps，因此它有且只有一个用途：**使用props来派生/更新state**。

getDerivedStateFromProps 在更新和挂载两个阶段都会“出镜”。因为“派生 state”这种诉求不仅在 props 更新时存在，在 props 初始化的时候也是存在的。

调用规则：

```js
static getDerivedStateFromProps(props, state) 
```

* 是一个**静态方法**。不依赖组件实例而存在，因此在该方法内部访问不到 this。
* 接收两个参数：props 和 state，分别代表当前组件接收到的来自父组件的 props 和当前组件自身的 state。
* 需要一个对象格式的返回值。getDerivedStateFromProps 的**返回值之所以不可或缺，是因为 React 需要用这个返回值来更新（派生）组件的 state。**
* 【注意】：**getDerivedStateFromProps 方法对 state 的更新动作并非“覆盖”式的更新，而是针对某个属性的定向更新**

### Updating 阶段

React 16.4在React 16.3的基础上进行了微调。React 16.4+的生命周期大图：

![Drawing 8.png](https://s0.lgstatic.com/i/image/M00/5D/CF/Ciqc1F-FVcSALRwNAAIomWwVcQU231.png)

React16.4 的挂载和卸载流程都是与 React16.3保持一致，差异在于更新流程上：

* React16.4中，**任何因素触发的组件更新流程**都会触发 getDerivedStateFromProps
* 而在 v 16.3 版本时，**只有父组件的更新**会触发该生命周期。

**为什么要用 getDerivedStateFromProps代替componentWillReceiveProps?**

> 与 componentDidUpdate 一起，这个新的生命周期涵盖过时componentWillReceiveProps 的所有用例。——React官方

* **试图代替 componentWillReceiveProps** （基于props派生state）
* **不能完全和 componentWillReceiveProps 画等号**（合理的减法）
* getDerivedStateFromProps 生命周期替代 componentWillReceiveProps 的背后，**是 React 16 在强制推行“只用 getDerivedStateFromProps 来完成 props 到 state 的映射”这一最佳实践**。意在确保生命周期函数的行为更加可控可预测，从根源上帮开发者避免不合理的编程方式，避免生命周期的滥用；同时，也是在为新的 Fiber 架构铺路。

**消失的componentWillMount与新增的getSnapshortBeforeUpdate**

```js
getSnapshotBeforeUpdate(prevProps, prevState) {
  // ...
}
```

- getSnapshotBeforeUpdate 的返回值会作为第三个参数给到 componentDidUpdate。它的执行时机是在 render 方法之后，真实 DOM 更新之前。在这个阶段里，我们可以同时获取到更新前的真实 DOM 和更新前后的 state&props 信息。

- 这个生命周期的设计初衷，是为了“与 componentDidUpdate 一起，涵盖过时的 componentWillUpdate 的所有用例”（引用自 React 官网）。getSnapshotBeforeUpdate 要想发挥作用，离不开 componentDidUpdate 的配合。

- 尽管在实际工作中，需要用到这么多信息的场景并不多，但在对于实现一些特殊的需求来说，没它还真的挺难办。这里我举一个非常有代表性的例子：实现一个内容会发生变化的滚动列表，要求根据滚动列表的内容是否发生变化，来决定是否要记录滚动条的当前位置。

  这个需求的前半截要求我们对比更新前后的数据（感知变化），后半截则需要获取真实的 DOM 信息（获取位置），这时用 getSnapshotBeforeUpdate 来解决就再合适不过了。

### Updating阶段

与React15一致。

## 本质：React 16为何两次求变

### Fiber 架构简析

Fiber 是 React 16 对 React 核心算法的一次重写。**Fiber 会使原本同步的渲染过程变成异步的。**

在 React 16 之前，每当我们触发一次组件的更新，React 都会构建一棵新的虚拟 DOM 树，通过与上一次的虚拟 DOM 树进行 diff，实现对 DOM 的定向更新。这个过程，是一个递归的过程。下面这张图形象地展示了这个过程的特征：

![图片4.png](https://s0.lgstatic.com/i/image/M00/5F/B0/Ciqc1F-Kl0WAO2mzAABxddWHnXI121.png)

如图所示，**同步渲染的递归调用栈是非常深的**，只有最底层的调用返回了，整个渲染过程才会开始逐层返回。**这个漫长且不可打断的更新过程，将会带来用户体验层面的巨大风险：同步渲染一旦开始，便会牢牢抓住主线程不放，直到递归彻底完成。在这个过程中，浏览器没有办法处理任何渲染之外的事情，会进入一种无法处理用户交互**的状态。因此若渲染时间稍微长一点，页面就会面临卡顿甚至卡死的风险。

而 React 16 引入的 Fiber 架构，恰好能够解决掉这个风险：**Fiber 会将一个大的更新任务拆解为许多个小任务**。每当执行完一个小任务时，**渲染线程都会把主线程交回去，**看看有没有优先级更高的工作要处理，确保不会出现其他任务被“饿死”的情况，进而避免同步渲染带来的卡顿。在这个过程中，**渲染线程不再“一去不回头”，而是可以被打断的**，这就是所谓的“异步渲染”，它的执行过程如下图所示：

![图片5.png](https://s0.lgstatic.com/i/image/M00/5F/B0/Ciqc1F-Kl1CAA6pwAADpyi-xSnM494.png)

### 换个角度看生命周期工作流

Fiber 架构的重要特征就是**可以被打断的**异步渲染模式。但这个“打断”是有原则的，根据“**能否被打断**”这一标准，React 16 的生命周期被划分为了 render 和 commit 两个阶段，而 commit 阶段又被细分为了 pre-commit 和 commit。每个阶段所涵盖的生命周期如下图所示：

![Drawing 13.png](https://s0.lgstatic.com/i/image/M00/5D/CF/Ciqc1F-FVn6AEtlxAAIomWwVcQU485.png)

我们先来看下三个阶段各自有哪些特征（以下特征翻译自上图）。

- render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动。

- pre-commit 阶段：可以读取 DOM。

- commit 阶段：可以使用 DOM，运行副作用，安排更新。


**总的来说，render 阶段在执行过程中允许被打断，而 commit 阶段则总是同步执行的**。

为什么这样设计呢？简单来说，由于 render 阶段的操作对用户来说其实是“不可见”的，所以就算打断再重启，对用户来说也是零感知。而 commit 阶段的操作则涉及真实 DOM 的渲染，再狂的框架也不敢在用户眼皮子底下胡乱更改视图，所以这个过程必须用同步渲染来求稳。

### 细说生命周期“废旧立新”背后的思考

在 Fiber 机制下，**render 阶段是允许暂停、终止和重启的**。当一个任务执行到一半被打断后，下一次渲染线程抢回主动权时，这个任务被重启的形式是“重复执行一遍整个任务”而非“接着上次执行到的那行代码往下走”。**这就导致 render 阶段的生命周期都是有可能被重复执行的。**

带着这个结论，我们再来看看 React 16 打算废弃的是哪些生命周期：

- componentWillMount；

- componentWillUpdate；

- componentWillReceiveProps。


这些生命周期的共性，就是**它们都处于 render 阶段，都可能重复被执行**，而且由于这些 API 常年被滥用，它们在重复执行的过程中都存在着不可小觑的风险。

在“componentWill”开头的生命周期里，你习惯于做的事情可能包括但不限于:

- setState()；

- fetch 发起异步请求；

- 操作真实 DOM。


这些操作的问题（或不必要性）包括但不限于以下 3 点：

**（1）完全可以转移到其他生命周期（尤其是 componentDidxxx）里去做。**

比如在 componentWillMount 里发起异步请求。很多同学因为太年轻，以为这样做就可以让异步请求回来得“早一点”，从而避免首次渲染白屏。

可惜你忘了，异步请求再怎么快也快不过（React 15 下）同步的生命周期。componentWillMount 结束后，render 会迅速地被触发，所以说**首次渲染依然会在数据返回之前执行**。这样做不仅没有达到你预想的目的，还会导致服务端渲染场景下的冗余请求等额外问题，得不偿失。

**（2）在 Fiber 带来的异步渲染机制下，可能会导致非常严重的 Bug。**

试想，假如你在 componentWillxxx 里发起了一个付款请求。由于 render 阶段里的生命周期都可以重复执行，在 componentWillxxx 被**打断 + 重启多次**后，就会发出多个付款请求。

比如说，这件商品单价只要 10 块钱，用户也只点击了一次付款。但实际却可能因为 componentWillxxx 被打断 + 重启多次而多次调用付款接口，最终付了 50 块钱；又或者你可能会习惯在 componentWillReceiveProps 里操作 DOM（比如说删除符合某个特征的元素），那么 componentWillReceiveProps 若是执行了两次，你可能就会一口气删掉两个符合该特征的元素。

结合上面的分析，我们再去思考 getDerivedStateFromProps 为何会在设计层面直接被约束为一个触碰不到 this 的静态方法，其背后的原因也就更加充分了——避免开发者触碰 this，就是在避免各种危险的骚操作。

**（3）即使你没有开启异步，React 15 下也有不少人能把自己“玩死”。**

比如在 componentWillReceiveProps  和 componentWillUpdate 里滥用 setState 导致重复渲染死循环的，大家都懂哈（邪魅一笑）。

总的来说，**React 16 改造生命周期的主要动机是为了配合 Fiber 架构带来的异步渲染机制**。在这个改造的过程中，React 团队精益求精，**针对生命周期中长期被滥用的部分推行了具有强制性的最佳实践**。这一系列的工作做下来，首先是**确保了 Fiber 机制下数据和视图的安全性**，同时也**确保了生命周期方法的行为更加纯粹、可控、可预测。**



**看到一篇写的比较好的文章**：[深入 React 生命周期 ](https://github.com/sisterAn/blog/issues/34)

推荐一篇文章**从源码角度分析为什么舍弃componentWillxxx**：[深入源码剖析componentWillXXX为什么UNSAFE](https://juejin.cn/post/6847902224287285255)

