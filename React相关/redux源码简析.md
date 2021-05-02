## createStore

createStore 创建一个仓库，是 redux 核心所在，最后返回四个非常重要的属性，分别是 getState、subscribe、dispatch 和 replaceReducer。

```js
export default function createStore (reducer, preloadedState, enhancer) {
  //...
  return {
    getState,// 获取到 state
    subscribe,// 采用发布订阅模式，这个方法进行观察者的订阅
    dispatch,// 派发 action
    replaceReducer// 用新的 reducer 替换现在的
  }
}
```

进入 createStore，第一步是检查参数，一共可以接收三个参数，**reducer** 表示改变 store 数据的纯函数，**preloadedState** 表示初始状态，**enhancer**表示中间件，后面再解释。

```js
export default function createStore (reducer, preloadedState, enhancer) {
  //reducer 必须是函数
  // 当前 reducer
  let currentReducer = reducer
  //state 数据，redux 的根本
  let currentState = preloadedState
  // 订阅者集合
  let currentListeners = []
  // 虽然不起眼，但是是一个关键的设计
  let nextListeners = currentListeners
  // 是否正在有 dispatch 在运行
  let isDispatching = false

  //...
  //return 代码
}
```

### getState

getState 方法就是返回当前的 state

```js
function getState () {
  // 如果有 dispatch 正在执行则报错
  if (isDispatching) throw new Error ("xxxx 具体信息省略")
  return currentState
}
```

### subscribe

subscribe 是基于**发布订阅模式**的，我们想一想只有一个数组来存放订阅者的时候可能会出现什么问题。

假若有十个订阅者订阅了 store, 然后一旦条件触发 store 会依次执行所有的订阅者 (注意这里的订阅者 listener 都是方法，下面代码中的类型判断里面有提)。

这个时候第一个方法中干了一件特别 "孙子" 的事情，它把其他 9 个人全部退订了。那这个时候数组里面只剩下 1 个订阅者，但是循环还在继续啊，从数组后面的索引拿订阅者来执行，会报错，因为 已经不存在了。

当然还有更加复杂的情况，这些情况本质上是订阅者 (可以认为函数) 拥有订阅和退订的权利，也就是说，它可以改变订阅者数组。但是我们遍历订阅者的时候是基于最开始的那个订阅者数组。

因此我们需要缓存最开始的数组，在调用订阅者的时候，一切关于 currentListeners 的改变都不允许，但是可以拷贝一份同样的数组，让它来承担订阅者对数组的改变，那这个数组就是 nextListeners。

```js
function ensureCanMutateNextListeners () {
  // 如果 next 和 current 数组是一个引用，那这种情况是危险的，原因上面已经谈到，我们需要 next 和 current 保持各自独立
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice ()
  }
}

function subscribe (listener) {
  if (typeof listener !== 'function') {
    throw new Error ('Expected the listener to be a function.')
  }
  // 如果正在有 dispatch 执行则报错
  if (isDispatching) {
    throw new Error ("xxx")
  }
  let isSubscribed = true
  ensureCanMutateNextListeners ()
  nextListeners.push (listener)
  // 返回的是一个退订的方法，将特定的 listener 从订阅者集合中删除
  return function unsubscribe () {
    // 用于防止多次调用 unsubscribe
    if (!isSubscribed) return;
    if (isDispatching) throw new Error ("xxx 具体信息省略")

    isSubscribed = false
    ensureCanMutateNextListeners ()
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
  }
}
```

值得注意的是每次调用这个函数的时候，都会产生一个闭包，里面存储着 isSubscribed 的值，调用 n 次就会产生 n 个这样的闭包，用来存储 n 个不同的订阅情况。 仔细想想还是比较巧妙的做法。

### dispatch

```js
function dispatch (action) {
  //action 必须是一个对象
  //action.type 不能为 undefined

  if (isDispatching) {
    throw new Error ('Reducers may not dispatch actions.')
  }

  try {
    isDispatching = true
    // 调用 reducer，计算新的 state
    currentState = currentReducer(currentState, action)
  } finally {
    isDispatching = false
  }
  //触发订阅
  const listeners = (currentListeners = nextListeners)
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }

  return action
}
```

### replaceReducer

```js
function replaceReducer (nextReducer) {
  if (typeof nextReducer !== 'function') {
    throw new Error ('Expected the nextReducer to be a function.')
  }

  currentReducer = nextReducer
  // 此时无法匹配任何的 action，但是返回的状态可以将 currentState 给更新
  // 也就是更新当前的 state，因为 reducer 更新了，老的 state 该换了！
  dispatch ({ type: ActionTypes.REPLACE })
}
```

### 初始化

```js
 // 初始化 state，当派发一个 type 为 ActionTypes.INIT 的 action，每个 reducer 都会返回
    // 它的初始值
    dispatch({ type: ActionTypes.INIT });
```

## combineReducer

combineReducer 用来组织不同模块的 reducer，那背后是怎么组织起来的呢？除去容错性的代码，我们看看 combineReducer 的核心源代码:

```js
export default function combineReducers (reducers) {
  // 以项目中的例子来讲，reducerKeys 就是 ['recommend', 'singers']
  const reducerKeys = Object.keys(reducers)
  //finalReducers 是 reducers 过滤后的结果
  // 确保 finalReducers 里面每一个键对应的值都是函数
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys (finalReducers)

  // 最后依然返回一个纯函数
  return function combination (state = {}, action) {
    // 这个标志位记录初始的 state 是否和经过 reducer 后是一个引用，如果不是则 state 被改变了
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      // 原来的状态树中 key 对应的值
      const previousStateForKey = state[key]
      // 调用 reducer 函数，获得该 key 值对应的新状态
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 这个很简单理解吧？如果没改变直接把原始的 state 返回即可
    return hasChanged ? nextState : state
  }
}
```

## compose

compose 其实是一个工具，充分体现了高阶函数的技巧。源码如下:

```js
export default function compose (...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs [0]
  }

  return funcs.reduce((a, b) => (...args) => a (b (...args)))
}
```

举个例子:

```js
const f0 = (x) => { console.log (x) }
const f1 = () => { console.log (1) }
const f2 = () => { console.log (2) }
let fArr = [f2, f1, f0];
console.log (compose (...fArr)(100)) // 执行 f2 (f1 (f0 (100))) 输出 100 1 2
```

## applyMiddleware 

这个方法与中间件息息相关，一上来就干讲是很不容易理解的，现在我们以项目中用到的 redux-thunk 中间件为例来演示，先放出 redux-thunk 的源码 (你没看错，就这么一点儿):

``` js
function createThunkMiddleware (extraArgument) {
  // 这里将 middlewareAPI 给解构成了 { dispatch, getState }
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action (dispatch, getState, extraArgument)
    }

    return next (action)
  }
}

const thunk = createThunkMiddleware ();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

现在我们来打开 applyMiddleware 的源代码:

```js
export default function applyMiddleware (...middlewares) {
  //返回值是一个接收 createStore 为入参的函数
  return createStore => (...args) => {
    //首先调用createStore创建一个store
    const store = createStore (...args)
    let dispatch = () => {
      //为了避免在接下来中间件链的串联过程中，dispatch被调用
      throw new Error (
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    //middlewareAPI是中间件的入参，其实就是拿到 store 的信息
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 参考上面的 thunk，其实就是传入 store 参数，剩下的部分为 next => action => { ... };
    // 传入这个参数是必须的，因为需要拿到 store 的相关属性，如 thunk 拿了 getState
    // 这里的意思就是每个中间件都能拿到 store 的数据
   	//遍历中间件数组，调用每个中间件，并且传入middlewareAPI作为入参，得到目标函数数组 chain
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    //改写原有的dispatch
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

加入现在还有一个 redux-logger 的中间件，调用 applyMiddleware (logger, thunk), 那么走到 compose 逻辑的时候，相当于 调用 logger (thunk (store.dispatch))。这样就完成了中间件的机制。仔细体会一下这中间的执行顺序，其实并不难。

## 探究 createStore 留下来的问题

刚刚在 createStore 那一段提了下参数类型判断，但是第三个参数没有展开讲，那这里面究竟是如何来判断的呢？现在我觉得时机成熟了。

给出这一部分源代码:

```js
export default function createStore (reducer, preloadedState, enhancer) {
  // 第二个参数为函数，但是第三个参数没传
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState  // 将第二个参数当做 enhancer 
    preloadedState = undefined
  }
  // 确保 enhancer 为函数
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error ('Expected the enhancer to be a function.')
    }

    return enhancer (createStore)(reducer, preloadedState)
  }
  //...
}
```

判断类型后返回 enhancer (...) 是针对什么样的场景的呢？

如果要用 thunk 中间件，那么 redux 官方文档是这么写的:

```js
const store = createStore(reducer, applyMiddleware (thunk));
```

看到没？这个时候其实 redux 内部的 enhancer 就变成了 applyMiddleware (thunk) 的结果。

运行流程其实变成了 applyMiddleware (thunk)(createStore)(reducer, preloadedState);

而返回的结果赋给了 store, 当前 store 中的 dispatch 属性已经成功被更改，一旦走入 dispatch，必然经过中间件。中间件成功地集成！

知道了原理后，相信你再写一个自己的 Redux 中间件也易如反掌了。

```js
function createMyMiddleware (...arg) {
  return ({ dispatch, getState }) => next => action => {
    console.log ("我开发的 Redux 中间件")
    return next(action);
  }
}

const myMiddleware = createMyMiddleware ()

export default myMiddleware;
```

然后在 createStore 的时候应用:

```js
import thunk from 'react-thunk';
import myMiddleware from 'my-middleware';
const store = createStore (reducer, applyMiddleware (thunk, myMiddleware));
```

中间件里面具体编写什么内容，应该由业务场景来决定，这里就不展开了。

## Redux 源码中一些有意思的工具函数

### 1. 判断是否为普通的对象

```js
export default function isPlainObject (obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf (proto) !== null) {
    proto = Object.getPrototypeOf (proto)
  }

  return Object.getPrototypeOf (obj) === proto
}
```

### 2. 生成随机字符串

```js
const randomString = () =>
  Math.random ()
    .toString (36)
    .substring (7)
    .split ('')
    .join ('.')
```