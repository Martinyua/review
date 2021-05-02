## 前言

> It provides a third-party extension point between dispatching an
> action, and the moment it reaches the reducer.

这是 redux 作者 Dan 对 middleware 的描述，middleware 在action被分发之后、reducer触发之前提供了一个第三方扩展点。

## 为什么 dispatch 需要 middleware

![img](https://pic2.zhimg.com/80/cb0c1722a4b1959fabe062bd053efa1d_720w.png)

上图表达的是 redux 中一个简单的同步数据流动的场景，点击 button 后，在回调中 dispatch 一个 action，reducer 收到 action 后，更新 state 并通知 view 重新渲染。单向数据流，看着没什么问题。但是，如果需要打印每一个 action 信息用来调试，就得去改 dispatch 或者 reducer 代码，使其具有打印日志的功能；又比如点击 button 后，需要先去服务器请求数据，只有等拿到数据后，才能重新渲染 view，此时我们又希望 dispatch 或者 reducer 拥有异步请求的功能；再比如需要异步请求完数据后，打印一条日志，再请求数据，再打印日志，再渲染...

面对多种多样的业务需求，单纯的修改 dispatch 或 reducer 的代码显然不具有普世性，我们需要的是可以组合的，自由插拔的插件机制，这一点 redux 借鉴了 [koa](https://link.zhihu.com/?target=http%3A//koa.bootcss.com/) 里中间件的思想，koa 是用于构建 web 应用的 NodeJS 框架。另外 reducer 更关心的是数据的转化逻辑，所以 redux 的 middleware 是为了增强 dispatch 而出现的。

![img](https://pic3.zhimg.com/80/9c456d5d211602e9d742262c2bf45762_720w.png)

上面这张图展示了应用 middleware 后 redux 处理事件的逻辑，每一个 middleware 处理一个相对独立的业务需求，通过串联不同的 middleware，实现变化多样的的功能。那么问题来了：

1. middleware 怎么写？
2. redux 是如何让 middlewares 串联并跑起来的？

## 四步理解 middleware 机制

redux 提供了 applyMiddleware 这个 api 来加载 middleware，为了方便理解，下图将两者的源码放在一起进行分析。

![img](https://pic1.zhimg.com/80/8fe84a1600b6b2d98dc69dc08f016e00_720w.png)

图下边是 logger，打印 action 的 middleware，图上边则是 applyMiddleware 的源码，applyMiddleware 代码虽然只有二十多行，却非常精炼，接下来我们就分四步来深入解析这张图。

> redux 的代码都是用 ES6/7 写的，所以不熟悉诸如 store => next => action => 或 ...state 的童鞋，可以先学习下[箭头函数](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，[展开运算符](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator)。

**Step. 1 函数式编程思想设计 middleware**

middleware 的设计有点特殊，是一个层层包裹的匿名函数，这其实是函数式编程中的**柯里化** [curry](https://link.zhihu.com/?target=http%3A//segmentfault.com/a/1190000003733107)，一种使用匿名单参数函数来实现多参数函数的方法。applyMiddleware 会对 logger 这个 middleware 进行层层调用，动态地对 store 和 next 参数赋值。

柯里化的 middleware 结构好处在于：

1. 易串联，柯里化函数具有延迟执行的特性，通过不断柯里化形成的 middleware 可以累积参数，配合组合（ compose，函数式编程的概念，Step. 2 中会介绍）的方式，很容易形成 pipeline 来处理数据流。
2. 共享store，在 applyMiddleware 执行过程中，store 还是旧的，但是因为闭包的存在，applyMiddleware 完成后，所有的 middlewares 内部拿到的 store 是最新且相同的。

另外，我们可以发现 applyMiddleware 的结构也是一个多层柯里化的函数，借助 compose ， applyMiddleware 可以用来和其他插件一起加强 createStore 函数。

```js
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
)(createStore);
```

**Step. 2 给 middleware 分发 store**

创建一个普通的 store 通过如下方式：

```js
let newStore = applyMiddleware(mid1, mid2, mid3, ...)(createStore)(reducer, null);
```

上面代码执行完后，applyMiddleware 函数陆续获得了三个参数，第一个是 middlewares 数组，[mid1, mid2, mid3, ...]，第二个 next 是 Redux 原生的 createStore，最后一个是 reducer。我们从对比图中可以看到，applyMiddleware 利用 createStore 和 reducer 创建了一个 store，然后 store 的 getState 方法和 dispatch 方法又分别被直接和间接地赋值给 middlewareAPI 变量，middlewareAPI 就是对比图中红色箭头所指向的函数的入参 store。

```js
var middlewareAPI = {
  getState: store.getState,
  dispatch: (action) => dispatch(action)
};
chain = middlewares.map(middleware => middleware(middlewareAPI));
```

map 方法让每个 middleware 带着 middlewareAPI 这个参数分别执行一遍，即执行红色箭头指向的函数。执行完后，获得 chain 数组，[f1, f2, ... , fx, ...,fn]，它保存的对象是图中绿色箭头指向的匿名函数，因为闭包，每个匿名函数都可以访问相同的 store，即 middlewareAPI。

> 备注: middlewareAPI 中的 dispatch 为什么要用匿名函数包裹呢？
>
> 我们用 applyMiddleware 是为了改造 dispatch 的，所以 applyMiddleware 执行完后，dispatch 是变化了的，而 middlewareAPI 是 applyMiddleware 执行中分发到各个 middleware，所以必须用匿名函数包裹 dispatch， 这样只要 dispatch 更新了， middlewareAPI 中的 dispatch 应用也会发生变化。

**Step. 3 组合串联 middlewares**

```js
dispatch = compose(...chain)(store.dispatch);
```

这一层只有一行代码，但却是 applyMiddleware 精华所在。[compose](https://link.zhihu.com/?target=https%3A//llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html) 是函数式编程中的组合，compose 将 chain 中的所有匿名函数，[f1, f2, ... , fx, ..., fn]，组装成一个新的函数，即新的 dispatch，当新 dispatch 执行时，[f1, f2, ... , fx, ..., fn]，从右到左依次执行（ 所以顺序很重要）。Redux 中 compose 的实现是下面这样的，当然实现方式不唯一。

```js
function compose(...funcs) {
  return arg => funcs.reduceRight((composed, f) => f(composed), arg);
}
```

compose(...chain) 返回的是一个匿名函数，函数里的 funcs 就是 chain 数组，当调用 reduceRight 时，依次从 funcs 数组的右端取一个函数 fx 拿来执行，fx 的参数 composed 就是前一次 fx+1 执行的结果，而第一次执行的fn（n代表chain的长度）的参数 arg 就是 store.dispatch。所以当 compose 执行完后，我们得到的 dispatch 是这样的，假设 n = 3。

```text
dispatch = f1(f2(f3(store.dispatch))))
```

这个时候调用新 dispatch，每个 middleware 的代码不就依次执行了嘛。

**Step. 4 在 middleware 中调用 dispatch 会发生什么**

经过 compose，所有的 middleware 算是串联起来了，可是还有一个问题，我们有必要挖一挖。在 step 2 时，提到过每个 middleware 都可以访问 store，即 middlewareAPI 这个变量，所以就可以拿到 store 的 dispatch 方法，那么在 middleware 中调用 store.dispatch()会发生什么，和调用 next() 有区别吗？比如下图：

![img](https://pic2.zhimg.com/80/v2-1185bb97b79663bc360c8b420be070c1_720w.png)

在 step 2 的时候我们解释过，通过匿名函数的方式，middleware 中 拿到的 dispatch 和最终 compose 结束后的新 dispatch 是保持一致的，所以在middleware 中调用 store.dispatch() 和在其他任何地方调用效果是一样的，而在 middleware 中调用 next()，效果是进入下一个 middleware。下面这张图说明一切。

![img](https://pic3.zhimg.com/80/v2-e5b8f433fec45c09260759fb12e90bb6_720w.png)



正常情况下，如图左，当我们 dispatch 一个 action 时，middleware 通过 next(action) 一层一层处理和传递 action 直到 redux 原生的 dispatch。如果某个 middleware 使用 store.dispatch(action) 来分发 action，就发生了右图的情况，相当于从外层重新来一遍，假如这个 middleware 一直简单粗暴地调用 store.dispatch(action)，就会形成无限循环了。那么 store.dispatch(action) 的勇武之地在哪里？正确的使用姿势应该是怎么样的？

举个例子，需要发送一个异步请求到服务器获取数据，成功后弹出一个自定义的 Message。这里我门用到了 [redux-thunk](https://link.zhihu.com/?target=https%3A//github.com/gaearon/redux-thunk) 这个作者写的 middleware。

```js
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action)
```

redux-thunk 做的事情就是判断 action 类型是否是函数，若是，则执行 action，若不是，则继续传递 action 到下个 middleware。

针对上面的需求，我们设计了下面的 action：

```js
const getThenShow = (dispatch, getState) => {
  const url = 'http://xxx.json';

  fetch(url)
  .then(response => {
    dispatch({
      type: 'SHOW_MESSAGE_FOR_ME',
      message: response.json(),
    });
  }, e => {
    dispatch({
      type: 'FETCH_DATA_FAIL',
      message: e,
    });
  });
};
```

这个时候只要在业务代码里面调用 store.dispatch(getThenShow)，redux-thunk 就会拦截并执行 getThenShow 这个 action，getThenShow 会先请求数据，如果成功，dispatch 一个显示 Message 的 action，否则 dispatch 一个请求失败的 action。这里的 dispatch 就是通过 redux-thunk middleware 传递进来的。

在 middleware 中使用 dispatch 的场景一般是：
接受到一个定向 action，这个 action 并不希望到达原生的 dsipatch，存在的目的是为了触发其他新的 action，往往用在异步请求的需求里。

## 总结

applyMiddleware 机制的核心在于组合 compose，将不同的 middlewares 一层一层包裹到原生的 dispatch 之上，而为了方便进行 compose，需对 middleware 的设计采用柯里化 curry 的方式，达到动态产生 next 方法以及保持 store 的一致性。由于在 middleware 中，可以像在外部一样轻松访问到 store, 因此可以利用当前 store 的 state 来进行条件判断，用 dispatch 方法拦截老的 action 或发送新的 action。



## applyMiddleware源码解析

applyMiddleware 函数最短但是最 Redux 最精髓的地方，成功的让 Redux 有了极大的可拓展空间，在 action 传递的过程中带来无数的“副作用”，虽然这往往也是麻烦所在。 这个 middleware 的洋葱模型思想是从 koa 的中间件拿过来的，用图来表示最直观。

上图之前先上一段用来示例的代码（via [中间件的洋葱模型](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/middleware-onion-model.md?1524474265778)），我们会围绕这段代码理解 applyMiddleware 的洋葱模型机制：

```js
function M1(store) {
  return function(next) {
    return function(action) {
      console.log('A middleware1 开始');
      next(action)
      console.log('B middleware1 结束');
    };
  };
}

function M2(store) {
  return function(next) {
    return function(action) {
      console.log('C middleware2 开始');
      next(action)
      console.log('D middleware2 结束');
    };
  };
}

function M3(store) {
  return function(next) {
    return function(action) {
      console.log('E middleware3 开始');
      next(action)
      console.log('F middleware3 结束');
    };
  };
}
  
function reducer(state, action) {
  if (action.type === 'MIDDLEWARE_TEST') {
    console.log('======= G =======');  
  }
  return {};
}
  
var store = Redux.createStore(
  reducer,
  Redux.applyMiddleware(
    M1,
    M2,
    M3
  )
);

store.dispatch({ type: 'MIDDLEWARE_TEST' });
```

再放上 Redux 的洋葱模型的示意图（via [中间件的洋葱模型](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/middleware-onion-model.md?1524474265778)），以上代码中间件的洋葱模型如下图：

```
            --------------------------------------
            |            middleware1              |
            |    ----------------------------     |
            |    |       middleware2         |    |
            |    |    -------------------    |    |
            |    |    |  middleware3    |    |    |
            |    |    |                 |    |    |
          next next next  ———————————   |    |    |
dispatch  —————————————> |  reducer  | — 收尾工作->|
nextState <————————————— |     G     |  |    |    |
            | A  | C  | E ——————————— F |  D |  B |
            |    |    |                 |    |    |
            |    |    -------------------    |    |
            |    ----------------------------     |
            --------------------------------------


顺序 A -> C -> E -> G -> F -> D -> B
    \---------------/   \----------/
            ↓                ↓
      更新 state 完毕      收尾工作
```

我们将每个 middleware 真正带来副作用的部分（在这里副作用是好的，我们需要的就是中间件的副作用），称为M?副作用，它的函数签名是 `(action) => {}`（记住这个名字）。

![image](https://user-gold-cdn.xitu.io/2018/4/24/162f63631ad2023b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



对这个示例代码来说，Redux 中间件的洋葱模型运行过程就是：

用户派发 action → action 传入 M1 副作用 → 打印 A → 执行 M1 的 next（这个 next 指向 M2 副作用）→ 打印 C → 执行 M2 的 next（这个 next 指向 M3 副作用）→ 打印 E → 执行 M3 的 next（这个 next 指向`store.dispatch`）→ 执行完毕返回到 M3 副作用打印 F → 返回到 M2 打印 E → 返回到 M1 副作用打印 B -> dispatch 执行完毕。

那么问题来了，M1 M2 M3的 next 是如何绑定的呢？

答：**柯里化绑定**，一个中间件完整的函数签名是 `store => next => action {}`，但是最后执行的洋葱模型只剩下了 action，外层的 store 和 next 经过了柯里化绑定了对应的函数，接下来看一下 next 是如何绑定的。

```
const store = createStore(...args)
let chain = []
const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
}
chain = middlewares.map(middleware => middleware(middlewareAPI)) // 绑定 {dispatch和getState}
dispatch = compose(...chain)(store.dispatch) // 绑定 next
```

关键点就是两句绑定，先来看第一句

```
chain = middlewares.map(middleware => middleware(middlewareAPI)) // 绑定 {dispatch和getState}
```

为什么要绑定 `getState`？因为中间件需要随时拿到当前的 state，为什么要拿到 `dispatch`？因为中间件中可能会存在派发 action 的行为（比如 redux-thunk），所以用这个 map 函数柯里化绑定了 `getState` 和 `dispatch`。

此时 `chain = [(next)=>(action)=>{…}, (next)=>(action)=>{…}, (next)=>(action)=>{…}]`，`…` 里闭包引用着 `dispatch` 和 `getState`。

接下来 `dispatch = compose(...chain)(store.dispatch)`，先了解一下 `compose` 函数

```
compose(A, B, C)(arg) === A(B(C(arg)))
```

这就是 compose 的作用，从右至左依次将右边的返回值作为左边的参数传入，层层包裹起来，在 React 中嵌套 Decorator 就是这么写，比如：

```
compose(D1, D2, D3)(Button)
// 层层包裹后的组件就是
<D1>
    <D2>
        <D3>
        	<Button />
        </D3>
    </D2>
</D1>
```

再说回 Redux

```
dispatch = compose(...chain)(store.dispatch) 
```

在实例代码中相当于

```
dispatch = MC1(MC2(MC3(store.dispatch)))
```

MC就是 chain 中的元素，没错，这又是一次柯里化。



![image](https://user-gold-cdn.xitu.io/2018/4/24/162f6596b92e98f1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



至此，真相大白，dispatch 做了一点微小的贡献，一共干了两件事：1. 绑定了各个中间件的 next。2. 暴露出一个接口用来接收 action。其实说了这么多，**middleware 就是在自定义一个dispatch**，这个 dispatch 会按照洋葱模型来进行 pipe。

OK，到现在我们已经拿到了想要的 dispatch，返回就可以收工了，来看最终执行的灵魂一图流：

![wx20180424-001706 2x](https://user-gold-cdn.xitu.io/2018/4/24/162f63632082731b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 细节

然而可达鸭眉头一皱，发现事情还没这么简单，有几个问题要想一下

### dispatch

```
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
```

在这里 dispatch 使用匿名函数是为了能在 middleware 中调用 compose 的最新的 dispatch（闭包），必须是匿名函数而不是直接写成 store.dispatch。

如果直接写成 `store.dispatch`，那么在某个 middleware（除最后一个，最后一个middleware拿到的是原始的 `store.dispatch`）dispatch 一个 action，比如 redux-thunk

```
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}
```

就是拦截函数类型的 action，再能够对函数形式的 action（其实是个 actionCreator）暴露 API 再执行一次，如果这个 actionCreator 是多层函数的嵌套，则必须每次执行 actionCreator 后的 actionCreator 都可以引用最新的 dispatch 才行。如果不写成匿名函数，那这个 actionCreator 又走了没有经过任何中间件修饰的 `store.dispatch`，这显然是不行的。所以要写成匿名函数的闭包引用。

还有，这里使用了 `...args` 而不是 `action`，是因为有个 [PR](https://github.com/reactjs/redux/pull/2560)，这个 PR 的作者认为在 dispatch 时需要提供多个参数，像这样 `dispatch(action, option)` ，这种情况确实存在，但是只有当这个需提供多参数的中间件是第一个被调用的中间件时（即在 middlewares 数组中排最后）才**肯定**有效 ，因为无法保证上一个调用这个多参数中间件的中间件是使用的 next(action) 或是 next(...args) 来调用，所以被改成了 next(…args) ，在这个 PR 的讨论中可以看到 Dan 对这个改动持保留意见（但他还是改了），这个改动其实真的挺蛋疼的，我作为一个纯良的第三方中间件，怎么能知道你上个中间件传了什么乱七八糟的属性呢，再说传了我也不知道是什么意思啊大哥。感觉这就是为了某些 middleware 能够配合使用，不想往 action 里加东西，就加在参数中了，到底是什么参数只有这些有约定好参数的 middleware 才能知道了。

### redux-logger

> Note: logger **must be** the last middleware in chain, otherwise it will log thunk and promise, not actual actions ([#20](https://github.com/evgenyrodionov/redux-logger/issues/20)).

要求必须把自己放在 middleware 的最后一个，理由是

> Otherwise it'll log thunks and promises but not actual actions.

试想，logger 想 log 什么？就是 `store.dispatch` 时的信息，所以 logger 肯定要在 `store.dispatch` 的前后 console，还记不记得上面哪个中间件拿到了 store.dispatch，就是最后一个，如果把 `logger` 放在第一个的话你就能打出所有的 `action` 了，比如 `redux-thunk` 的 actionCreator，打印的数量肯定比放在最后一个多，因为并不是所有的 action 都能走到最后，也有新的 action 在 middleware 在中间被派发。





### 洋葱模型简介

![img](https://mmbiz.qpic.cn/mmbiz_png/jQmwTIFl1V2VKicWozBAOabSRdico9uTF0crNo05v6GxwY4cKkFXlTUkDcPicy9YZMXchOpPcWv5k9ahZ8F32SR3Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

（图片来源：https://eggjs.org/en/intro/egg-and-koa.html）

在上图中，洋葱内的每一层都表示一个独立的中间件，用于实现不同的功能，比如异常处理、缓存处理等。每次请求都会从左侧开始一层层地经过每层的中间件，当进入到最里层的中间件之后，就会从最里层的中间件开始逐层返回。因此对于每层的中间件来说，在一个 **请求和响应** 周期中，都有两个时机点来添加不同的处理逻辑。

### 洋葱模型应用

除了在 Koa 中应用了洋葱模型之外，该模型还被广泛地应用在 Github 上一些不错的项目中，比如 koa-router 和阿里巴巴的 midway、umi-request 等项目中。

介绍完 Koa 的中间件和洋葱模型，阿宝哥根据自己的理解，抽出以下通用的任务处理模型：

![img](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V2VKicWozBAOabSRdico9uTF0qs4jYLLsBic119uM5Br02WJmWgCHibGNibZiawVoNWEnGrTwnPDXAvvz8Q/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

上图中所述的中间件，一般是与业务无关的通用功能代码，比如用于设置响应时间的中间件：

```
// x-response-time
async function responseTime(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set("X-Response-Time", ms + "ms");
}
```

其实，对于每个中间件来说，前置处理器和后置处理器都是可选的。比如以下中间件用于设置统一的响应内容：

```
// response
async function respond(ctx, next) {
  await next();
  if ("/" != ctx.url) return;
  ctx.body = "Hello World";
}
```

尽管以上介绍的两个中间件都比较简单，但你也可以根据自己的需求来实现复杂的逻辑。Koa 的内核很轻量，麻雀虽小五脏俱全。它通过提供了优雅的中间件机制，让开发者可以灵活地扩展 Web 服务器的功能，这种设计思想值得我们学习与借鉴。

https://juejin.im/post/6844903597776306190#heading-1

https://juejin.im/post/6844903457757855757

https://zhuanlan.zhihu.com/p/20597452

https://juejin.im/book/6844733816460804104/section/6844733816599216141

