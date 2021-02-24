# React理念

### 理念

 react的理念关键是**快速响应**

快速响应的两个瓶颈是**CPU瓶颈**和**IO瓶颈**

### React的解决方法

**将同步的更新变为可中断的异步更新**

* CPU瓶颈：在浏览器每一帧时间中，留一部分给JS线程，用于React更新组件，如果时间不够，则将控制权交给浏览器使其渲染UI，React等待下一帧的时间来继续刚中断的工作。（时间切片）
* IO瓶颈：将人机交互研究的结果整合到真实的 UI 中



### 老React架构

React15架构分为两层：

* **Reconciler**（协调器）——复制找出变化的组件
* **Render**（渲染器）——负责将变化的组件渲染到页面上

**缺点**：在reconciler中mount的组件会调用**mountComponent**，update的组件会调用**updateComponent**，这两个方法都会**递归**更新子组件，当递归开始执行，就无法中断，层级很深时，更新时间超过了16ms，用户就会卡顿



### 新React架构

React16架构可以分为三层：

- **Scheduler**（调度器）：调度任务的优先级，高优先级进入Reconciler
- **Reconciler**（协调器）：找出变化的组件
- **Renderer**（渲染器）：负责将变化的组件渲染到页面上

Reconciler更新工作从递归变成了**可以中断的循环过程**。每次循环都会调用shouldYield判断是否有剩余时间。同样解决了更新时**DOM渲染不完全的问题**，Reconciler与Renderer不再是交替工作，整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

### fiber架构

Fiber 并不是计算机术语中的新名词，他的中文翻译叫做纤程，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。
React Fiber 可以理解为：

- React 内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。(Fiber Reconciler: 纤程)
- React16 虚拟 DOM (Fiber Tree)



**代数效应**：`代数效应`能够将`副作用`从函数逻辑中分离，使函数关注点保持纯粹。比如`代数效应`能够将`副作用`从函数逻辑中分离，使函数关注点保持纯粹。

为什么不是Generator？类似async，Generator也是传染性的，使用了Generator则上下文的其他函数也需要作出改变

Fiber的含义：

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```



1. 之前React15的Reconcile**r采用递归**的方式执行，数据保存在递归调用栈中，所以被称为**stack Reconciler**。React16的Reconciler基于**Fiber节点**实现，被称为**Fiber Reconciler**

2. 对于静态的数据结构来说，每个Fiber节点对应一个**React element**，保存了该组件的类型，对应DOM节点等信息。
3. 作为动态的工作单元，它Fiber节点保存了本次更新中该组件的状态，要执行的工作（被删除/插入/更新）

Fiber的结构：

1. 作为**架构**，**构成Fiber树![Fiber架构](https://react.iamkasong.com/img/fiber.png)**

2. 作为**静态数据结构**，保存**组件相关信息**

   ```js
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

   

3. 作为**工作单元**保存**更新信息**



### fiber工作原理

#### 双缓存技术

直接在**内存中构建**并且**替换**的技术叫做双缓存技术。

React使用“双缓存”来完成**Fiber树的构建与替换**——**对应着DOM树的创建与更新。**

#### 双缓存FIber树

react最多会同时存在两棵树：

* 屏幕上显示对应的Fiber树`current Fiber`树
* 正在内存构建的Fiber树`workInProgress Fiber`树
* 两棵树的节点通过`alternate`连接
* 每次更新都会产生新的`workInProgress Fiber`树，react通过`current`指针的指向来确定当前的`current Fiber`
* `workInProgress fiber`的创建可以**复用**`current Fiber树`对应的节点数据。是否复用取决于`diff`算法





### JSX

* 在被编译时会被编译为React.createElement。

JSX和FIber节点的区别：**JSX是描述当前组件内容的一种数据结构**，**他不包含schedule，reconcile，render的所需相关信息**。比如组件更新的优先级，组件的state，被打上的render信息。

所以，在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。在`update`时，`Reconciler`将`JSX`与`Fiber节点`保存的数据对比，生成组件对应的`Fiber节点`，并根据对比结果为`Fiber节点`打上`标记`

