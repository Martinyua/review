> 【好文收集】文章来源：https://segmentfault.com/a/1190000015282620

一、react-router-config 是一个帮助我们配置静态路由的小助手。 其源码就是一个高阶函数利用一个map函数生成静态路由

```jsx
import React from "react";
import Switch from "react-router/Switch";
import Route from "react-router/Route";
const renderRoutes = (routes, extraProps = {}, switchProps = {}) =>
routes ? (
    <Switch {...switchProps}>
        {routes.map((route, i) => ( 
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props => (
            <route.component {...props} {...extraProps} route={route} />
          )}
        />
      ))}
    </Switch>
  ) : null;
 export default renderRoutes;
```

//router.js 假设这是我们设置的路由数组（这种写法和vue很相似是不是?)

```javascript
const routes = [
    { path: '/',
        exact: true,
        component: Home,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/user',
        component: User,
    },
    {
        path: '*',
        component: NotFound
    }
]
```

//app.js 那么我们在app.js里这么使用就能帮我生成静态的路由了

```jsx
import { renderRoutes } from 'react-router-config'
import routes from './router.js'
const App = () => (
   <main>
      <Switch>
         {renderRoutes(routes)}
      </Switch>
   </main>
)

export default App
```

扯了半天，要如何利用这个插件帮我们路由鉴权呢？ 用过vue的小朋友都知道，vue的router.js 里面添加 `meta: { requiresAuth: true }` 然后利用`导航守卫`

```javascript
router.beforeEach((to, from, next) => {
  // 在每次路由进入之前判断requiresAuth的值，如果是true的话呢就先判断是否已登陆
})
```

二、**基于类似vue的路由鉴权想法，我们稍稍改造一下react-router-config** // utils/renderRoutes.js

```jsx
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
const renderRoutes = (routes, authed, authPath = '/login', extraProps = {}, switchProps = {}) => routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={(props) => {
          if (!route.requiresAuth || authed || route.path === authPath) {
            return <route.component {...props} {...extraProps} route={route} />
          }
          return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />
        }}
      />
    ))}
  </Switch>
) : null

export default renderRoutes
```

修改后的源码增加了两个参数 authed 、 authPath 和一个属性 route.requiresAuth 然后再来看一下最关键的一段代码

```javascript
if (!route.requiresAuth || authed || route.path === authPath) {
    return <route.component {...props} {...extraProps} route={route} />
    }
    return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />
```

很简单 如果 route.requiresAuth = false 或者 authed = true 或者 route.path === authPath（参数默认值'/login'）则渲染我们页面，否则就渲染我们设置的**authPath**页面，并记录从哪个页面跳转。

相应的router.js也要稍微修改一下

```javascript
const routes = [
    { path: '/',
        exact: true,
        component: Home,
        requiresAuth: false,
    },
    {
        path: '/login',
        component: Login,
        requiresAuth: false,

    },
    {
        path: '/user',
        component: User,
        requiresAuth: true, //需要登陆后才能跳转的页面

    },
    {
        path: '*',
        component: NotFound,
        requiresAuth: false,
    }
]
```

//app.js

```jsx
import React from 'react'
import { Switch } from 'react-router-dom'
//import { renderRoutes } from 'react-router-config'
import renderRoutes from './utils/renderRoutes'
import routes from './router.js'

const authed = false // 如果登陆之后可以利用redux修改该值(关于redux不在我们这篇文章的讨论范围之内）
const authPath = '/login' // 默认未登录的时候返回的页面，可以自行设置

const App = () => (
   <main>
      <Switch>
         {renderRoutes(routes, authed, authPath)}
      </Switch>
   </main>
)
export default App
//登陆之后返回原先要去的页面login函数
login(){
    const { from } = this.props.location.state || { from: { pathname: '/' } }
     // authed = true // 这部分逻辑自己写吧。。。
    this.props.history.push(from.pathname)
}
```

以上～修改了部分源码并完成了我们想要的效果。