## React 的理念

React 的理念

> 我们认为，React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。 ——官网

**快速响应**即：**速度快，响应自然**。

### 响应快

由于语法的灵活，在编译时无法区分可能变化的部分。所以在运行时，`React`需要遍历每个元素，判断其数据是否更新。基于以上原因，相比于`Vue`、`Angular`，缺少编译时优化手段的`React`为了**速度快**需要在运行时做出更多努力。

- 使用`PureComponent`或`React.memo`构建组件
- 使用`shouldComponentUpdate`生命周期钩子
- 渲染列表时使用`key`
- 使用`useCallback`和`useMemo`缓存函数和变量
- ……

由开发者来显式的告诉`React`哪些组件不需要重复计算、可以复用。

### 响应自然

> 将人机交互研究的结果整合到真实的 UI 中

将**同步的更新**变为**可中断的异步更新**。

## React15架构

React 15的架构可以分为两层：

* Recociler(协调器)：负责找出变化的组件
* Renderer(渲染器)：负责将变化的组件渲染到页面

### Reconciler（协调器）

在`React`中可以通过`this.setState`、`this.forceUpdate`、`ReactDOM.render`等API触发更新。

每当有更新发生时，**Reconciler**会做如下工作：

- 调用函数组件、或class组件的`render`方法，将返回的JSX转化为虚拟DOM
- 将虚拟DOM和上次更新时的虚拟DOM对比
- 通过对比找出本次更新中变化的虚拟DOM
- 通知**Renderer**将变化的虚拟DOM渲染到页面上（找出需要重绘或重排的元素，告诉浏览器。浏览器根据相关的更新，重新计算 DOM Tree，重绘页面。）

### Renderer（渲染器）

由于`React`支持跨平台，所以不同平台有不同的**Renderer**。我们前端最熟悉的是负责在浏览器环境渲染的**Renderer** —— [ReactDOM](https://www.npmjs.com/package/react-dom)。

除此之外，还有：

- [ReactNative](https://www.npmjs.com/package/react-native)渲染器，渲染App原生组件
- [ReactTest](https://www.npmjs.com/package/react-test-Renderer)渲染器，渲染出纯Js对象用于测试
- [ReactArt](https://www.npmjs.com/package/react-art)渲染器，渲染到Canvas, SVG 或 VML (IE8)

**在每次更新发生时，Renderer接到Reconciler通知，将变化的组件渲染在当前宿主环境。**

### React15架构的缺点

- 在**Reconciler**中，`mount`的组件会调用[mountComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498)，`update`的组件会调用[updateComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877)。这两个方法都会**递归**更新子组件。
- React15 的调度策略 – Stack reconcile。这个策略像函数调用栈一样，会深度优先遍历所有的 Virtual DOM 节点，进行Diff。它一定要等整棵 Virtual DOM 计算完成之后，才将任务出栈释放主线程。所以，在浏览器主线程被 React 更新状态任务占据的时候，用户与浏览器进行任何的交互都不能得到反馈，只有等到任务结束，才能突然得到浏览器的响应。【**同步更新，不可中断**】
- React 这样的调度策略对动画的支持也不好。如果 React 更新一次状态，占用浏览器主线程的时间超过 16.6 ms，就会被人眼发现前后两帧不连续，给用户呈现出动画卡顿的效果。【主流的浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。我们知道，JS可以操作DOM，`GUI渲染线程`与`JS线程`是互斥的。所以**JS脚本执行**和**浏览器布局、绘制**不能同时执行。】
- `Reconciler`采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

## React 16架构

React16架构可以分为三层：

- **Scheduler（调度器）**—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

### Scheduler（调度器）

既然我们以**浏览器是否有剩余时间作为任务中断的标准**，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

`React`放弃使用 requestIdleCallback原因：【浏览器对 [requestIdleCallback ](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)和 [requestAnimationFrame ](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)实现了类似功能】

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的`requestIdleCallback`触发的频率会变得很低

基于以上原因，`React`实现了功能更完备的`requestIdleCallback`polyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。

> [Scheduler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md)是独立于`React`的库

### Reconciler（协调器）

从`React15`到`React16`，协调器（`Reconciler`）重构的一大目的是：**将老的`同步更新`的架构变为`异步可中断更新`。**

`异步可中断更新`可以理解为：`更新`在执行过程中可能会被打断（①有其他更高优先级任务需要先更新②当前帧没有剩余时间），当可以继续执行时恢复之前执行的中间状态。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么React16是如何解决**中断更新时DOM渲染不完全的问题**呢？

在React16中，**Reconciler**与**Renderer**不再是交替工作【React15架构的Reconciler和Renderer是交替工作的】。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟DOM打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

整个**Scheduler**与**Reconciler**的工作都在内存中进行，不会更新到DOM上面。【所以即使反复中断，用户也不会看见更新不完全的DOM】只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

Reconciler 内部采用了 **Fiber** 的结构。

### Renderer（渲染器）

**Renderer**根据**Reconciler**为虚拟DOM打的标记，同步执行对应的DOM操作。



## Fiber

> Fiber 架构的心智模型：参考[Fiber 架构的心智模型]([https://react.iamkasong.com/process/fiber-mental.html#%E4%BB%80%E4%B9%88%E6%98%AF%E4%BB%A3%E6%95%B0%E6%95%88%E5%BA%94](https://react.iamkasong.com/process/fiber-mental.html#什么是代数效应))、[代数效应入门](https://juejin.im/post/6844903976299675662)
>
> Fiber 架构的**应用目的**，按照 React 官方的说法，是实现“**增量渲染**”。所谓“增量渲染”，通俗来说就是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里面。不过严格来说，增量渲染其实也只是一种手段，实现增量渲染的目的，是为了实现任务的可中断、可恢复，并给不同的任务赋予不同的优先级，最终达成更加顺滑的用户体验。

### Fiber 的含义

`Fiber`包含三层含义：

1. 作为**架构**来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`。

   每个Fiber节点有个对应的`React element`，多个`Fiber节点`通过如下三个属性连接成树。

   ```javascript
   // 指向父级Fiber节点
   this.return = null;
   // 指向子Fiber节点
   this.child = null;
   // 指向右边第一个兄弟Fiber节点
   this.sibling = null;
   ```

2. 作为**静态的数据结构**来说，每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。

   ```javascript
   // Fiber对应组件的类型 Function/Class/Host...
   this.tag = tag;
   // key属性
   this.key = key;
   // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
   this.elementType = null;
   // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
   this.type = null;
   // Fiber对应的真实DOM节点
   this.stateNode = null;
   ```

3. 作为**动态的工作单元**来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）

   ```javascript
   // 保存本次更新造成的状态改变相关信息
   this.pendingProps = pendingProps;
   this.memoizedProps = null;
   this.updateQueue = null;
   this.memoizedState = null;
   this.dependencies = null;
   
   this.mode = mode;
   
   // 保存本次更新会造成的DOM操作
   this.effectTag = NoEffect;
   this.nextEffect = null;
   
   this.firstEffect = null;
   this.lastEffect = null;
   ```

另外，如下两个字段保存调度优先级相关的信息，会在讲解`Scheduler`时介绍。

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

**总结**：从架构角度来看，Fiber 是对 React 核心算法（即调和过程）的重写；从编码角度来看，Fiber 是 React 内部所定义的一种数据结构，它是 Fiber 树结构的节点单位，也就是 React 16 新架构下的“虚拟 DOM”；从工作流的角度来看，Fiber 节点保存了组件需要更新的状态和副作用，一个 Fiber 同时也对应着一个工作单元。

### Fiber 工作原理

`Fiber节点`可以保存对应的`DOM节点`。相应的，`Fiber节点`构成的`Fiber树`就对应`DOM树`。那么如何更新`DOM`呢？这需要用到被称为“双缓存”的技术。

#### 双缓存是什么

- 当我们用`canvas`绘制动画，每一帧绘制前都会调用`ctx.clearRect`清除上一帧的画面。
- 如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。
- 为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。
- 这种**在内存中构建并直接替换**的技术叫做[双缓存](https://baike.baidu.com/item/双缓冲)。
- `React`使用“双缓存”来完成`Fiber树`的构建与替换——对应着`DOM树`的创建与更新。

#### 双缓存Fiber树

在`React`中最多会同时存在两棵`Fiber树`。**当前屏幕上显示内容对应的`Fiber树`称为`current Fiber树`，正在内存中构建的`Fiber树`称为`workInProgress Fiber树`。**

`current Fiber树`中的`Fiber节点`被称为`current fiber`，`workInProgress Fiber树`中的`Fiber节点`被称为`workInProgress fiber`，他们通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

`React`应用的根节点通过**`current`**指针在不同`Fiber树`的`rootFiber`间切换来实现`Fiber树`的切换。

**当`workInProgress Fiber树`构建完成交给`Renderer`渲染在页面上后，应用根节点的`current`指针指向`workInProgress Fiber树`，此时`workInProgress Fiber树`就变为`current Fiber树`。**

**每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的替换，完成`DOM`更新。**

### `Fiber树`的构建与替换过程

`Fiber树`的构建与替换过程，这个过程伴随着`DOM`的更新。

**以具体例子讲解`mount时`、`update时`的构建/替换流程**

#### mount 时

```javascript
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

1. 首次执行`ReactDOM.render`会创建`fiberRootNode`（源码中叫`fiberRoot`）和`rootFiber`。其中**`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App/>`所在组件树的根节点**。

   之所以要区分`fiberRootNode`与`rootFiber`，是因为在应用中我们可以多次调用`ReactDOM.render`渲染不同的组件树，他们**会拥有不同的`rootFiber`。但是整个应用的根节点只有一个，那就是`fiberRootNode`。**

   **`fiberRootNode`的`current`会指向当前页面上已渲染内容对应对`Fiber树`，被称为`current Fiber树`。**

   ```js
   fiberRootNode.current = rootFiber;
   ```

   由于是首屏渲染，页面中还没有挂载任何`DOM`，所以`fiberRootNode.current`指向的`rootFiber`没有任何`子Fiber节点`（即`current Fiber树`为空）。

<img src="https://react.iamkasong.com/img/rootfiber.png" alt="rootFiber" style="zoom: 50%;" />

​	

2. 接下来进入**`render阶段`**，根据组件返回的`JSX`在内存中依次创建`Fiber节点`并连接在一起构建`Fiber树`，被称为`workInProgress Fiber树`。（下图中右侧为内存中构建的树，左侧为页面显示的树）

   在构建`workInProgress Fiber树`时会尝试复用`current Fiber树`中已有的`Fiber节点`内的属性，在`首屏渲染`时只有`rootFiber`存在对应的`current fiber`（即`rootFiber.alternate`）。

<img src="https://react.iamkasong.com/img/workInProgressFiber.png" alt="workInProgressFiber" style="zoom:50%;" />

3. 图中右侧已构建完的`workInProgress Fiber树`在`commit阶段`渲染到页面。

   此时`DOM`更新为右侧树对应的样子。`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`。

<img src="https://react.iamkasong.com/img/wipTreeFinish.png" alt="workInProgressFiberFinish" style="zoom:50%;" />

#### update 时

1.接下来我们点击`p节点`触发状态改变，这会开启一次新的`render阶段`并构建一棵新的`workInProgress Fiber 树`。

<img src="https://react.iamkasong.com/img/wipTreeUpdate.png" alt="wipTreeUpdate" style="zoom:50%;" />

和`mount`时一样，`workInProgress fiber`的创建可以复用`current Fiber树`对应的节点数据。

> 这个决定是否复用的过程就是Diff算法，后面章节会详细讲解

2.`workInProgress Fiber 树`在`render阶段`完成构建后进入`commit阶段`渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为`current Fiber 树`。

<img src="https://react.iamkasong.com/img/currentTreeUpdate.png" alt="currentTreeUpdate" style="zoom:50%;" />

## Fiber Reconciler 与 Stack Reconciler 的不同

[Fiber ](https://en.wikipedia.org/wiki/Fiber_(computer_science))是一种轻量的执行线程，同线程一样共享定址空间，线程靠系统调度，并且是抢占式多任务处理，Fiber 则是自调用，协作式多任务处理。

首先，使用**协作式多任务处理任务**。将原来的整个 Virtual DOM 的更新任务拆分成一个个小的任务。每次做完一个小任务之后，放弃一下自己的执行将主线程空闲出来，看看有没有其他的任务。如果有的话，就暂停本次任务，执行其他的任务，如果没有的话，就继续下一个任务。

**整个页面更新并重渲染过程分为两个阶段。**

1. Reconcile 阶段。此阶段中，依序遍历组件，通过 diff 算法，判断组件是否需要更新，给需要更新的组件加上 tag。遍历完之后，将所有带有 tag 的组件加到一个链表中。这个阶段的任务可以被打断。
2. Commit 阶段。根据在 Reconcile 阶段生成的数组，遍历更新 DOM，这个阶段需要一次性执行完。如果是在其他的渲染环境 – Native，硬件，就会更新对应的元素。

所以之前浏览器主线程执行更新任务的执行流程就变成了这样。

![img](https://static001.infoq.cn/resource/image/e0/5f/e0f82fb59682fa5d0a3d92cbd13c1c5f.png)

其次，**对任务进行优先级划分**。不是每来一个新任务，就要放弃现执行任务，转而执行新任务。与我们做事情一样，将任务划分优先级，只有当比现任务优先级高的任务来了，才需要放弃现任务的执行。比如说，屏幕外元素的渲染和更新任务的优先级应该小于响应用户输入任务。若现在进行屏幕外组件状态更新，用户又在输入，浏览器就应该先执行响应用户输入任务。浏览器主线程任务执行流程如下图所示。

![img](https://static001.infoq.cn/resource/image/8f/a9/8f87967034e48f24eeffe6dc9c00cba9.png)

使用了 ReactFiber 去渲染整个页面，ReactFiber 会将整个更新任务分成若干个小的更新任务，然后设置一些任务默认的优先级。每执行完一个小任务之后，会释放主线程。

需要考虑的问题：

- 比如说，task 按照优先级之后，可能低优先级的任务永远不会执行，称之为 starvation；
- 比如说，task 有可能被打断，需要重新执行，那么某些依赖生命周期实现的业务逻辑可能会受到影响。

* ……

React Fiber 也是带来了很多的好处的。

- 比如说，增强了某些领域的支持，比如动画、布局和手势；
- 比如说，在复杂页面，对用户的反馈会更及时，应用的用户体验会变好，简单页面看不到明显的差异；
- 比如说，api 基本上没有变化，对现有项目很友好。

## 资料引用

- [React的新引擎—React Fiber 是什么](https://www.infoq.cn/article/what-the-new-engine-of-react/)
- [React理念](https://react.iamkasong.com/process/doubleBuffer.html)

* [完全理解React Fiber](http://www.ayqy.net/blog/dive-into-react-fiber/#articleHeader0)

