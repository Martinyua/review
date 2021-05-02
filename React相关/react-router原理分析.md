-  `react-router`为`React`提供了路由能力, 不管是`web`应用或是`React Native`应用, 都可以使用`react-router`进行路由管理;
- 浏览器端路由其实并不是真实的网页跳转（和服务器没有任何交互），而是纯粹在浏览器端发生的一系列行为，本质上来说前端路由就是：**对 url 进行改变和监听，来让某个 dom 节点显示对应的视图**。

- react-router是React Router的**核心**, 实现了**路由的核心功能**;
- react-router-dom是React Router的DOM绑定, 提供了浏览器环境下的功能, 比如`<Link>`, `<BrowserRouter>`等组件;

## 常见路由模式

`SPA`(单页面应用)的路由模式一般分为两种:

1. **`hash`模式**，hash 路由，特征是 url 后面会有 `#` 号，如 `baidu.com/#foo/bar/baz`。
2. **`history`模式**，history 路由，url 和普通路径没有差异。如 `baidu.com/foo/bar/baz`。

**hash**

- 通过 `location.hash = 'foo'` 这样的语法来**改变**，路径就会由 `baidu.com` 变更为 `baidu.com/#foo`。
- 通过 `window.addEventListener('hashchange')` 这个事件，就可以**监听**到 `hash` 值的变化。

**history**

其实是用了 `history.pushState` 这个 API 语法**改变**，语法定义：

> ```js
> history.pushState(state, title[, url])
> ```

- 其中 `state` 代表状态对象，这让我们可以给每个路由记录创建自己的状态，并且它还会序列化后保存在用户的磁盘上，以便用户重新启动浏览器后可以将其还原。
- `title` 当前没啥用。
- `url` 在路由中最重要的 url 参数反而是个可选参数，放在了最后一位。

通过 `history.pushState({}, '', 'foo')`，可以让 `baidu.com` 变化为 `baidu.com/foo`。

**为什么路径更新后，浏览器页面不会重新加载？**

平常通过 `location.href = 'baidu.com/foo'` 这种方式来跳转，是会让浏览器重新加载页面并且请求服务器的，但是 `history.pushState` 可以让 url 改变，但是不重新加载页面，完全由用户决定如何处理这次 url 改变。

因此，这种方式的前端路由必须在支持 `histroy` API 的浏览器上才可以使用。

**为什么刷新后会 404？**

本质上是因为刷新以后是带着 `baidu.com/foo` 这个页面去请求服务端资源的，但是服务端并没有对这个路径进行任何的映射处理，当然会返回 404，处理方式是让服务端对于"不认识"的页面,返回 `index.html`，这样这个包含了前端路由相关`js`代码的首页，就会加载你的前端路由配置表，并且此时虽然服务端给你的文件是首页文件，但是你的 url 上是 `baidu.com/foo`，前端路由就会加载 `/foo` 这个路径相对应的视图，完美的解决了 404 问题。

对于`history` 路由的**监听**，浏览器提供了 `window.addEventListener('popstate')` 事件，但是它只能监听到浏览器回退和前进所产生的路由变化，对于主动的 `pushState` 却监听不到。

## 实现history

在引入了`react-router`的`React`应用中, 我们通常使用`react-router-dom`提供的`Link`组件进行路由跳转; 在`Link`组件中, 路由跳转相关代码如下:

```js
const method = replace ? history.replace : history.push;
method(location);
```

`replace`表示是否替换当前路由, `location`表示跳转的路由

可以看出, `react-router`实现路由跳转主要使用了`history.replace`以及`history.push`, 往上层探究后发现, 这里的**`history`是`react-router`开发者实现的一个库, 对`window.history`进行封装**, 利用`window.history.pushState`和`window.history.replaceState`两个`api`, 实现`url`跳转而无须重新加载页面;

**History.ts**

```js
const createHistory = (): History => {
  const globalHistory = window.history;
  const _history: History = {
    listeners: [],//存储 history.listen的回调函数
    listen(fn) {
      this.listeners.push(fn);
      return () => {
        listeners = listeners.filter(listener => listener !== fn);
      };
    },
    push(url, state) {
      globalHistory.pushState(state, '', url);
      this.listeners.forEach(listener =>listener(url));
    }
  };
  return _history;
};

export default createHistory;
```

上面是一个简单实现的`history`库, 只实现了`push`的功能, 主要分为三个部分:

1. **`listeners`**: 数组类型, 当`history.push`调用时, 依次执行`listeners`中的函数;
2. **`listen`**: 函数类型, 接受一个函数`listener`作参数, 并将`listener`加到`listeners`中, 等待`history.push`执行; 返回一个函数`unlisten`, 执行时将当前的`listener`从`listeners`中移除;
3. **`push`**: 函数类型, 接收一个`url`作为参数, 执行`globalHistory.pushState`(此处的`globalHistory`为`window.history`), 并依次执行`listeners`中所有函数;

从上面代码可以看出, `history`主要运用了**订阅-发布**设计模式的思想;

**App.ts**

```jsx
import React, {useEffect, useState} from 'react';
import createHistory from './history';
const history = createHistory();

const Page1= props => {
  return <div>Page1</div>;
};

const Page2 = props => {
  return <div>Page2</div>;
};

const App = props => {
  const [location, setLocation] = useState(window.location.pathname);
  const pushHistory = (event, url)=> {
    event.preventDefault();
    history.push(url);
  };
  const renderComponent = (): ReactElement => {
    switch (location) {
      case '/page1': {
        return <Page1></Page1>;
      }
      case '/page2': {
        return <Page2></Page2>;
      }
      default: {
        return <Page1></Page1>;
      }
    }
  };

  useEffect(() => {
    // 页面首次渲染完成后执行
    history.listen((url) => {
      setLocation(url);
    });
  }, []);

  return (
    <div>
      <div className="nav">
        <a href="/page1" onClick={(event) => pushHistory(event, '/page1')}>page1</a>
        <a href="/page2" onClick={(event) => pushHistory(event, '/page2')}>page2</a>
      </div>
      <div>{renderComponent()}</div>
    </div>
  );
};

export default App;
```

上面的代码生成的页面结构分为:

- 导航部分: 对超链接的默认事件进行阻止, 避免刷新页面, 并绑定新的点击事件, 触发`history.push`进行路由跳转;
- 路由组件渲染部分: 通过`location`变量渲染对应的路由组件;

代码逻辑结构如下:

1. 创建一个`history`示例;
2. 执行`renderComponent`函数, 渲染出当前路由对应组件;
3. `App`首次渲染完成时使用`history.listen`注册一个监听事件, 事件调用时使用`setLocation`将`location`设置为`url`参数; 并将`history.listen`返回的函数赋值给变量`unlisten`;
4. 点击超链接, 执行`history.push`跳转路由, 执行`history.listen`中的回调函数, 执行`setLocation`修改`location`变量的值, 导致组件重新渲染, `renderComponent`函数重新执行, 路由组件成功渲染;
5. 退出页面时, 执行`unlisten`函数, 销毁当前监听事件;



## 实现Router

### `<BrowserRouter>`的核心逻辑

`<BrowserRouter>`和`<HashHistory>`的代码结构和逻辑相似, 这里只对`<BrowserRouter>`作分析;

使用`history`的`createBrowserHistory`方法, 将props作为参数, 创建一个`history`实例, 并将`history`传入`Router`组件中:

```js
import { Router } from "react-router";
import { createBrowserHistory as createHistory } from "history";

class BrowserRouter extends React.Component {
  history = createHistory(this.props);
    render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

从源码中可以看出, `<BrowserRouter>`是一个注入了`history`的`<Router>`组件;

### `<Router>`的路由渲染逻辑

Router 的核心原理就是通过 `Provider` 把 `location` 和 `history` 等路由关键信息传递给子组件，并且在路由发生变化的时候要让子组件可以感知到：

```jsx
import React, { useState, useEffect, ReactNode } from 'react';
import { history, Location } from './history';
interface RouterContextProps {
  history: typeof history;
  location: Location;
}

export const RouterContext = React.createContext<RouterContextProps | null>(
  null,
);

export const Router: React.FC = ({ children }) => {
  const [location, setLocation] = useState(history.location);
  // 初始化的时候 订阅 history 的变化
  // 一旦路由发生改变 就会通知使用了 useContext(RouterContext) 的子组件去重新渲染
  useEffect(() => {
    const unlisten = history.listen(location => {
      setLocation(location);
    });
    return unlisten;
  }, []);

  return (
    <RouterContext.Provider value={{ history, location }}>
      {children}
    </RouterContext.Provider>
  );
};

```

在组件初始化的时候利用 `history.listen` 监听了路由的变化，一旦路由发生改变，就会调用 `setLocation` 去更新 `location` 并且通过 `Provider` 传递给子组件。

并且这一步也会触发 `Provider` 的 `value` 值的变化，通知所有用 `useContext` 订阅了 `history` 和 `location` 的子组件去重新 `render`。

**react-router中使用`context`进行组件通信**

- 在`<Router>`中, 使用`<RouterContext.Provider>`进行路由数据传递(history,location, `match`以及staticContext), 使用`<HistoryContext.Provider>`进行history数据传递, 子组件(`<Route>`或是`<Redirect>`等)可以通过`<RouterContext.Consumer>`以及`<HistoryContext.Consumer>`对上层数据进行接收; 

## 实现 Route

`Route` 组件接受 `path` 和 `children` 两个 `prop`，本质上就决定了在某个路径下需要渲染什么组件，我们又可以通过 `Router` 的 `Provider` 传递下来的 `location` 信息拿到当前路径，所以这个组件需要做的就是判断当前的路径是否匹配，渲染对应组件。

与其它路由组件一样, 使用`<RouterContext.Consumer>`接收全局路由信息; `<Route>`的逻辑比较简单, 主要判断`path`与当前路由是否匹配, 若是匹配则进行渲染对应路由组件, 若是不匹配则不进行渲染, 核心代码如下:

```jsx
import { ReactNode } from 'react';
import { useLocation } from './hooks';

interface RouteProps {
  path: string;
  children: ReactNode;
}

export const Route = ({ path, children }: RouteProps) => {
  const { pathname } = useLocation();
  const matched = path === pathname;

  if (matched) {
    return children;
  }
  return null;
};

```

注: 根据上面代码, 不论`props.match`是否为true, 当``的`children`为函数时都会进行渲染;

## 实现 useLocation、useHistory

利用 `useContext` 简单封装一层，拿到 `Router` 传递下来的 `history` 和 `location` 即可。

```jsx
import { useContext } from 'react';
import { RouterContext } from './Router';

export const useHistory = () => {
  return useContext(RouterContext)!.history;
};

export const useLocation = () => {
  return useContext(RouterContext)!.location;
};
```

## 其它

### `<Switch>`的渲染逻辑

> 即使有多个路由组件匹配成功，`Switch` 也只展示一个路由。

`<Switch>`使用`<RouterContext.Consumer>`进行路由数据接收; `<Switch>`对路由组件进行顺序匹配, 使用`React.Children.forEach`对`<Switch>`的子组件进行遍历, 每次遍历逻辑如下:

**使用`React.isValidElement`判断子组件是否为有效的element:**

- 有效: 则进入**下个步骤**;
- 无效: 结束此轮循环, 进行下一轮循环;

**声明`path:`**

```js
const path = child.props.path || child.props.from;
```

注: `<Switch>`使用**path**进行路由地址声明, `<Redirect>`使用**from**进行重定向来源地址声明;

接着判断**path**是否存在:

- 存在path: 表示子组件存在路由映射关系, 使用**matchPath**对path进行匹配, 判断路由组件的路径与当前`location.pathname`是否匹配:
- 若是匹配, 则对子组件进行渲染, 并将**matchPath**返回的值作为`computedMatch`传递到子组件中, 并且不再对其他组件进行渲染;
- 若是不匹配, 则直接进行下次循环; 注意: `location`可以是外部传入的`props.location`, 默认为`context.location`;
- 不存在path: 表示子组件不存在路由映射关系, 直接渲染该子组件, 并将`context.match`作为`computedMatch`传入子组件中;

**matchPath是react-router的一个公共api,**

### `withRouter`

`withRouter`是一个高阶组件, 支持传入一个组件, 返回一个能访问路由数据的**路由组件**, 实质上是将组件作为`<RouterContext.Consumer>`的子组件, 并将`context`的路由信息作为`props`注入组件中;

```jsx
const C = props => {
  // ...返回组件
  const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <RouterContext.Consumer>
                {context => {
          return (
            <Component
              {...remainingProps}
              {...context}
              ref={wrappedComponentRef}
            />
          );
        }}
      </RouterContext.Consumer>
    );
};

return hoistStatics(C, Component);
```

`hoistStatics`是三方库`hoist-non-react-statics`, 用于解决高阶组件中原组件static丢失的问题; 同时使用支持传入props: `wrappedComponentRef`, `wrappedComponentRef`绑定原组件的`ref`, 因此可以通过`wrappedComponentRef`访问到原组件; 需要注意的是, 函数式组件没有`ref`, 因为函数式组件并没有实例, 所以使用`withRouter`包裹函数式组件时, 不支持使用`wrappedComponentRef`访问原组件!

### useParams、useRouteMatch

```jsx
import { useContext } from 'react';
import { RouterContext } from './Router';

export const useHistory = () => {
   const match = useContext(RouterContext).match;
   return match ? match.params : {};
};

export const useLocation = () => {
  const location = useLocation();
  const match = useContext(RouterContext).match;
  return path ? matchPath(location.pathname, path) : match;
};
```

### 补充：hash模式与history模式的区别

**不同**

- hash —— 即地址栏 URL 中的 # 符号（此 hash 不是密码学里的散列运算）。比如这个 URL：http://www.abc.com/#/hello，hash 的值为 #/hello。它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。
- history —— 利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。（需要特定浏览器支持）这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。
- 因此可以说，hash 模式和 history 模式都属于浏览器自身的特性，Vue-Router 只是利用了这两个特性（通过调用浏览器提供的接口）来实现前端路由.

**使用场景**

一般场景下，hash 和 history 都可以，除非你更在意颜值，# 符号夹杂在 URL 里看起来确实有些不太美丽。

如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成URL 跳转而无须重新加载页面。

另外，根据 Mozilla Develop Network 的介绍，调用 history.pushState() 相比于直接修改 hash，存在以下优势:

- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。

当然啦，history 也不是样样都好。SPA 虽然在浏览器里游刃有余，但真要通过 URL 向后端发起 HTTP 请求时，两者的差异就来了。尤其在用户手动输入 URL 后回车，或者刷新（重启）浏览器的时候。

个人在接入微信的一个活动开发过程中 开始使用的hash模式，但是后面后端无法获取到我#后面的url参数，于是就把参数写在#前面，但是讨论后还是决定去掉这个巨丑的#

于是乎改用history模式，但是开始跑流程的时候是没问题，但是后来发现跳转后刷新或者回跳，会报一个404的错误，找不到指定的路由,最后后端去指向正确的路由 加了/hd/xxx 去匹配是否有这个/hd/{:path} 才得以解决

**总结**

1 hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 http://www.abc.com，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

2 history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.abc.com/book/id。如果后端缺少对 /book/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

3 结合自身例子，对于一般的 Vue + Vue-Router + Webpack + XXX 形式的 Web 开发场景，用 history 模式即可，只需在后端（Apache 或 Nginx）进行简单的路由配置，同时搭配前端路由的 404 页面支持。

## Questions

### react-router 里的 `<Link>` 标签和 `<a>` 标签有什么区别 

Link点击事件handleClick部分源码

```js
      if (_this.props.onClick) _this.props.onClick(event);

      if (!event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !_this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
          event.preventDefault();

          var history = _this.context.router.history;
          var _this$props = _this.props,
              replace = _this$props.replace,
              to = _this$props.to;


          if (replace) {
            history.replace(to);
          } else {
            history.push(to);
          }
        }
```

Link做了三件事

1. 有onclick那就执行onclick
2. click的时候阻止a标签默认事件（这样子点击链接不会跳转和刷新页面）
3. 再取得跳转href（即是to），用history（前端路由两种方式之一，history & hash）跳转，此时只是链接变了，并没有刷新页面

区别：

- 从最终渲染的 DOM 来看，这两者都是链接，都是 `<a>` 标签，`<Link>` 是 react-router 里实现路由跳转的链接，一般配合 `<Route>` 使用，react-router 接管了其默认的链接跳转行为
- 禁掉 a 标签的默认事件(点击不会发生跳转和刷新页面)，可以在点击事件中执行 event.preventDefault();
- 禁掉默认事件的 a 标签 可以使用 history.pushState() 来改变页面 url，这个方法还会触发页面的 hashchange 事件，Router 内部通过捕获监听这个事件来处理对应的跳转逻辑。

## 参考资料

* [深入探索前端路由，手写 react-mini-router](https://juejin.im/post/6875135569018486797)
* [从源码对react-router v5进行原理分析](https://zhuanlan.zhihu.com/p/210254026)
* [history与hash模式的区别](https://www.jb51.net/article/144341.htm)

