> **【好文收集】**文章来源：https://juejin.im/post/6883729053027844109

# React-Router

<img src="https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59e980d0854a453dbde86167bee6daee~tplv-k3u1fbpfcp-zoom-1.image" alt="img" style="zoom: 80%;" />

## 前端路由规则

### **URL的hash** 

- `URL`的`hash`也就是锚点(#), 本质上是改变`window.location`的`href`属性
- 我们可以直接赋值`location.hash`改变`url`, 但是页面不发生刷新

```js
const routerView1 = document.querySelector('.router-view')
window.addEventListener('hashchange', () => {
switch (window.location.hash) {
  case '#/home':
    routerView1.innerHTML = '首页';
    break;
  case '#/about':
    routerView1.innerHTML = '关于页';
    break;
  default:
    routerView1.innerHTML = '';
    break;
  }
})
```

注意:

- `hash`的优势就是兼容性更好, 在老版, `IE`中都可以运行
- 但是缺陷是有一个#, 显得不像一个真实的路径

### **HTML5的history** 

- history接口是HTML5新增的, 它有六种模式改变URL而不刷新页面：

| API          | 作用               |
| :----------- | :----------------- |
| replaceState | 替换原来的路径     |
| pushState    | 使用新的路径       |
| popState     | 路径的回退         |
| go           | 向前或向后改变路径 |
| forward      | 向前改变路径       |
| back         | 向后改变路径       |



## react-router

### **react-router介绍及安装** 

- React Router的版本4开始，路由不再集中在一个包中进行管理了
  - `react-router`是router的核心部分代码；
  - `react-router-dom`是用于浏览器的；
  - `react-router-native`是用于原生应用的；
- 目前我们使用最新的`React Router`版本是`v5`的版本：
  - 实际上`v4`的版本和`v5`的版本差异并不大；
- 安装`react-router`：
  - 安装`react-router-dom`会自动帮助我们安装`react-router`的依赖；
  - `yarn add react-router-dom`

### **Router的基本使用** 

`react-router`最主要的`API`是给我们提供的一些**「组件」**

- `BrowserRouter`或`HashRouter`组件【**路由器**】
  - `Router`中包含了对路径改变的监听, 并且会将相应的路径传递给子组件
  - `BrowserRouter`使用了`history`模式
  - `HasRouter`使用了`hash`模式
- `Link`组件和`NavLink`组件【**在应用程序中创建链接**】
  - 通常路径的跳转时是使用`Link`, 最终会被渲染成`a`元素
  - `NavLink`是在`Link`基础之上增加了一些样式属性(后续学习)
  - `to`属性: `link`组件中最重要的属性, 用于设置跳转到的路径
- `Route`组件
  - **「Route用于路径的匹配」**
  - `path`属性: 用户设置匹配到的路径
  - `component`属性: 设置匹配到的路径后, 渲染的组件
  - `exact`属性: 精准匹配, 只有精准匹配到完全一致的路径, 才会渲染对应的组件

```jsx
// ...
import { BrowserRouter, Link, Route } from 'react-router-dom'
export default class App extends PureComponent {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Link to="/">主页</Link>
          <Link to="/about">关于</Link>
          <Link to="/profile">我的</Link>
          {/*添加exact属性: 精准匹配*/}
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/profile" component={Profile} />
        </BrowserRouter>
      </div>
    )
  }
}
```

### **NavLink组件的使用** 

- 需求：**「路径选中时，对应的a元素变为红色」**
- 这个时候，我们要使用`NavLink`组件来替代`Link`组件
  - `activeStyle`: 活跃时(匹配时)的样式
  - `activeClassName`: 活跃时添加的`calss`
  - `exact`: 是否精准匹配

```jsx
{/* NavLink的使用,需求:路径选中时,对应的a元素变为红色 */}
<NavLink exact to="/" 
    activeClassName="link-active">
 主页
</NavLink>

<NavLink 
    to="/about" 
    activeStyle={{ color: 'red', fontSize: '35px' }}>
   关于
</NavLink>
```

### **Switch组件的使用** 

- 使用场景: 只要有一个`path`匹配上了对应的组件, 后续就不会再进行匹配了
- 我们来看下面的路由规则：
  - 当我们匹配到某一个路径时，我们会发现有一些问题
  - 比如 `/about` 路径匹配到的同时，`/:userid`也被匹配到了，并且最后的一个`NoMatch`组件总是被匹配到

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/741d953942e14e3787c7353fbfa79f70~tplv-k3u1fbpfcp-zoom-1.image)

- 原因是什么呢？默认情况下，`react-router`中只要是路径被匹配到的`Route`对应的组件**「都会被渲染」**
  - 但是实际开发中, 我们希望有一种排他的思想
  - 只要匹配到了第一个, 后面就不应该继续匹配了
  - 这个时候我们可以使用`Switch`来将所有`Route`组件进行包裹

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ed2ff8df0a4438c9de616e3e34f1126~tplv-k3u1fbpfcp-zoom-1.image)

### **Redirect 重定向** 

- Redirect用于路由的重定向, 当这个组件出现后, 就会执行跳转对应的`to`路径中

```jsx
<Redirect to="/login" />
```



## react-router其他补充

### **路由的嵌套** 

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b0749d8ba3b4d0b89ecace2efb5d70e~tplv-k3u1fbpfcp-zoom-1.image)

### **手动路由跳转 withRouter** 

> ❝
>
> 目前我们实现的跳转主要是通过`Link`或者`NavLink`进行跳转的，实际上我们也可以通过**「JavaScript」**代码进行跳转
>
> ❞

- 获取`history`对象
  - 方式一: 如果该组件是**「通过路由直接跳转过来」**的, 可以直接从`props`属性中获取`history, location, match`
  - 方式二：App组件中获取到`history`对象，需要使用`whitRouter`**高阶组件 **
    - `App`组件必须包裹在`BrowserRouter`或`HashRouter`组件之内
    - `App`组件使用`withRouter`高阶组件包裹

```jsx
// 1.不使用Link组件或NavLink组件实现跳转
  joinTo() {
    // 1.使用的history是通过Route组件传递的props
    // 2.通过Route传递的history对象来实现路径的跳转
    this.props.history.push('/about/join')
  }


// app.js
  jumpToProduct() {
    this.props.history.push('/product')
  }
```

### **参数传递** 

- **「传递参数有三种方式：」**
  - 动态路由的方式；
  - search传递参数；
  - Link中to传入对象

#### 动态路由传递参数:

- 比如我们将`path`在`Route`匹配时写成`/detail/:id`，那么`/detail/abc、/detail/123`都可以匹配到该`Route`，并且进行显示
- 图示 ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bf13c7a7c8c45209e471ae9aefb892b~tplv-k3u1fbpfcp-zoom-1.image)

```jsx
// App.js
<NavLink to={`/detail/${id}`}>详情</NavLink>
<Route path="/detail/:id" component={Detail} />

// Detail.js
{/* 获取动态路由传递的 id 参数 */}
<h2>Detail: {match.params.id}</h2>
```

#### search传递参数

- 在`Link`或`NavLink`组件通过`to`属性传递`query string`
- 图示   ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e037f8d8fb84e10b846ed61a7b72051~tplv-k3u1fbpfcp-zoom-1.image)

#### Link中 to 属性可以直接传入一个对象

```jsx
// app.js
<NavLink
  to={{
    pathname: "/detail",
    search: "?name=abc",
    state:  info
  }}
>进入详情</NavLink>
// detail.js
console.log(this.props.location)
```

## react-router-config

### react-router-config基本配置

> 目前我们所有的路由定义都是直接使用`Route`组件，并且添加属性来完成的 但是这样的方式会让路由变得非常混乱

- 将所有的路由配置放到一个地方进行集中管理

  - 使用: `react-router-config`来完成

- 安装`react-router-config`

  - `yarn add react-router-config`
  - 配置路由映射关系数组

```jsx
const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/profile', component: Profile },
  { path: '/detail/:id', component: Detail },
]
// app.js
import { renderRoutes } from 'react-router-config'
import routes from './router'
    render() {
        // ...
        { renderRoutes(routes) }
    }
// about.js
```

### 嵌套子路由配置映射关系

- 在**路由嵌套中配置路由映射关系**

```jsx
const routes = [
  {
    path: '/about',
    component: About,
    route: [
      { 
          path: '/about', 
          component: AboutHistory, 
          exact: true 
      },
      {
        path: '/about/join',
        component: AboutJoin,
      },
    ]
  }
]
// about.js ( 在被Route渲染的组件中: 使用props取出route )
  render() {
     { renderRoutes(this.props.route.route) }
  }
```