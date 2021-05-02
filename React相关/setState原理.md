> 【好文收集】：[setState 揭秘](http://imweb.io/topic/5b189d04d4c96b9b1b4c4ed6)
>
> 注意：以下的 setState 是基于 React15 的，React16引入fiber后，setState有所改变。
>
> 更多推荐：[你真的理解setState吗？](https://zhuanlan.zhihu.com/p/39512941)、[setState 到底是同步的，还是异步的？](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=510#/detail/pc?id=4860)

## setState 揭秘

### setState的使用注意事项

`setState(updater, callback)`这个方法是用来告诉react组件数据有更新，有可能需要重新渲染。它是异步的，react通常会集齐一批需要更新的组件，然后一次性更新来保证**渲染的性能**，所以这就给我们埋了一个坑：

那就是在使用`setState`改变状态之后，立刻通过`this.state`去拿最新的状态往往是拿不到的。

#### 要点一

所以第一个使用要点就是：如果你需要基于最新的state做业务的话，可以在`componentDidUpdate`或者`setState`的回调函数里获取。(注：官方推荐第一种做法)

```js
// setState回调函数
changeTitle: function (event) {
  this.setState({ title: event.target.value }, () => this.APICallFunction());
},
APICallFunction: function () {
  // Call API with the updated value
}
```

#### 要点二

【原理：在setState的时候，react内部会创建一个updateQueue，通过firstUpdate、lastUpate和lastUpate.next去维护一个更新的队列，在批量更新的时候，相同的key会被覆盖，只会对最后一次的setState进行更新。】

设想有一个需求，需要在在onClick里累加两次，如下

```js
  onClick = () => {
    this.setState({ index: this.state.index + 1 });
    this.setState({ index: this.state.index + 1 });
  }
```

在react眼中，这个方法最终会变成

```js
Object.assign(
  previousState,
  {index: state.index+ 1},
  {index: state.index+ 1},
  ...
)
```

由于后面的数据会覆盖前面的更改，所以最终只加了一次.所以如果是下一个state依赖前一个state的话，推荐给setState传function

```js
onClick = () => {
    this.setState((prevState, props) => {
      return {quantity: prevState.quantity + 1};
    });
    this.setState((prevState, props) => {
      return {quantity: prevState.quantity + 1};
    });
}
```

以上是使用setState的两个注意事项，接下来我们来看看setState被调用之后，更新组件的过程，下面是一个简单的流程图。

![img](https://user-gold-cdn.xitu.io/2018/8/30/1658a8a62d6bb975?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

下面来逐步的解析图里的流程。

### 一、setState

#### ReactBaseClassses.js

```js
ReactComponent.prototype.setState = function (partialState, callback) {
  //  将setState事务放进队列中
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

这里的partialState可以传object,也可以传function,它会产生新的state以一种`Object.assgine（）`的方式跟旧的state进行合并。

### 二、enqueueSetState

```js
  enqueueSetState: function (publicInstance, partialState) {
     // 获取当前组件的instance
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

     // 将要更新的state放入一个数组里
     var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    queue.push(partialState);

     //  将要更新的component instance也放在一个队列里
    enqueueUpdate(internalInstance);
  }
```

这段代码可以得知，enqueueSetState 做了两件事： 1、将新的state放进数组里 2、用enqueueUpdate来处理将要更新的实例对象

### 三、enqueueUpdate

#### ReactUpdates.js

```js
function enqueueUpdate(component) {
  // 如果没有处于批量创建/更新组件的阶段，则处理update state事务
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 如果正处于批量创建/更新组件的过程，将当前的组件放在dirtyComponents数组中
  dirtyComponents.push(component);
}
```

由这段代码可以看到，当前如果正处于创建/更新组件的过程，就不会立刻去更新组件，而是先把当前的组件放在dirtyComponent里，所以不是每一次的setState都会更新组件~。

这段代码就解释了我们常常听说的：**setState是一个异步的过程，它会集齐一批需要更新的组件然后一起更新**。

而batchingStrategy 又是个什么东西呢？

### 四、batchingStrategy

#### ReactDefaultBatchingStrategy.js

```js
var ReactDefaultBatchingStrategy = {
  // 用于标记当前是否出于批量更新
  isBatchingUpdates: false,
  // 当调用这个方法时，正式开始批量更新
  batchedUpdates: function (callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // 如果当前事务正在更新过程在中，则调用callback，既enqueueUpdate
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
    // 否则执行更新事务
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};
```

这里注意两点： 1、如果当前事务正在更新过程中，则使用`enqueueUpdate`将当前组件放在`dirtyComponent`里。 2、如果当前不在更新过程的话，则执行更新事务。

### 五、transaction

```
/**
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 */
```

简单说明一下transaction对象，它暴露了一个perform的方法，用来执行anyMethod，在anyMethod执行的前，需要先执行所有wrapper的initialize方法，在执行完后，要执行所有wrapper的close方法，就辣么简单。

在ReactDefaultBatchingStrategy.js,tranction 的 wrapper有两个 `FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES`

```js
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

可以看到，这两个wrapper的`initialize`都没有做什么事情，但是在callback执行完之后，RESET_BATCHED_UPDATES 的作用是将isBatchingUpdates置为false, FLUSH_BATCHED_UPDATES 的作用是执行flushBatchedUpdates,然后里面会循环所有dirtyComponent,调用updateComponent来执行所有的生命周期方法，componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate, render, componentDidUpdate 最后实现组件的更新。

## 补充1：异步的动机

从生命周期角度去看，当setState调用后，会触发shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate。可以看到，一个完整的更新流程，涉及了包括**re-render(重渲染)**在内的多个步骤。re-render 本身涉及对 DOM 的操作，它会带来较大的性能开销。假如说“一次 setState 就触发一个完整的更新流程”这个结论成立，那么每一次 setState 的调用都会触发一次 re-render，我们的视图很可能没刷新几次就卡死了。

 所以，**setState 异步的一个重要的动机——避免频繁的 re-render。**

在实际React运行时**，每来一个 setState，就把它塞进一个队列里“攒起来”。等时机成熟，再把“攒起来”的 state 结果做合并【Object.assign】，最后只针对最新的 state 值走一次更新流程。这个过程，叫作“批量更新”**。

## 补充2：为什么setState有时会表现为同步？

当我们在组件上绑定了事件之后，事件中也有可能会触发 setState。为了确保每一次 setState 都有效，React 同样会在此处手动开启批量更新。

以下为React事件系统中的一部分。

```js
// ReactEventListener.js
dispatchEvent: function (topLevelType, nativeEvent) {
  ...
  try {
    // 处理事件
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}
```

话说到这里，一切都变得明朗了起来：isBatchingUpdates 这个变量，在 React 的生命周期函数以及合成事件执行前，已经被 React 悄悄修改为了 true，这时我们所做的 setState 操作自然不会立即生效。当函数执行完毕后，事务的 close 方法会再把 isBatchingUpdates 改为 false。

以increment 方法为例，整个过程像是这样：

```js
increment = () => {
  // 进来先锁上
  isBatchingUpdates = true
  console.log('increment setState前的count', this.state.count)
  this.setState({
    count: this.state.count + 1
  });
  console.log('increment setState后的count', this.state.count)
  // 执行完函数再放开
  isBatchingUpdates = false
}
```

很明显，在 isBatchingUpdates 的约束下，setState 只能是异步的。而当 setTimeout 从中作祟时，事情就会发生一点点变化：

```js
reduce = () => {
  // 进来先锁上
  isBatchingUpdates = true
  setTimeout(() => {
    console.log('reduce setState前的count', this.state.count)
    this.setState({
      count: this.state.count - 1
    });
    console.log('reduce setState后的count', this.state.count)
  },0);
  // 执行完函数再放开
  isBatchingUpdates = false
}
```

会发现，咱们开头锁上的那个 isBatchingUpdates，对 setTimeout 内部的执行逻辑完全没有约束力。因为 isBatchingUpdates 是在同步代码中变化的，而 setTimeout 的逻辑是异步执行的。当 this.setState 调用真正发生的时候，isBatchingUpdates 早已经被重置为了 false，这就使得当前场景下的 setState 具备了立刻发起同步更新的能力。所以咱们前面说的没错——**setState 并不是具备同步这种特性，只是在特定的情境下，它会从 React 的异步管控中“逃脱”掉**。

## 总结

setState 并不是单纯同步/异步的这种差异，本质上是由 React 事务机制和批量更新机制的工作方式来决定的。

1. **`setState `只在合成事件和钩子函数中是“异步”的，在原生事件和`setTimeout`、`setInterval`等函数 中都是同步的。**
2. **`setState` 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 `setState(partialState, callback)` 中的`callback`拿到更新后的结果。**
3. **setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次`setState`，`setState`的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时`setState`多个不同的值，在更新时会对其进行合并批量更新。**

**推荐阅读**：https://oychao.github.io/2017/10/11/react/18_set_state/