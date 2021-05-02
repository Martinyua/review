> 【好文收集】：[【React深入】React事件机制](https://juejin.cn/post/6844903790198571021#heading-3)
>
> 推荐配合阅读：[React源码解析(四):事件系统](https://juejin.cn/post/6844903538762448910#heading-5)

# 【React深入】React事件机制

## 关于React事件的疑问

- 1.为什么要手动绑定`this`
- 2.`React`事件和原生事件有什么区别
- 3.`React`事件和原生事件的执行顺序，可以混用吗
- 4.`React`事件如何解决跨浏览器兼容
- 5.什么是合成事件

下面是我阅读过源码后，将所有的执行流程总结出来的流程图，不会贴代码，如果你想阅读代码看看具体是如何实现的，可以根据流程图去源码里寻找。

## 前言

**React 合成事件灵感**

- 把多个子元素的同一类型的监听逻辑，合并到父元素上通过一个监听函数来管理的行为，就是**事件委托**。

**React 事件系统是如何工作的？**

- React 的事件系统沿袭了事件委托的思想。在 React 中，除了少数特殊的不可冒泡的事件（比如媒体类型的事件）无法被事件系统处理外，绝大部分的事件都不会被绑定在具体的元素上，而是统一被绑定在页面的 document 上。**当事件在具体的 DOM 节点上被触发后，最终都会冒泡到 document 上，document 上所绑定的统一事件处理程序会将事件分发到具体的组件实例。**
- 在分发事件之前，React 首先会对事件进行包装，把原生 DOM 事件包装成**合成事件**。
- **虽然合成事件并不是原生 DOM 事件，但它保存了原生 DOM 事件的引用。**当你需要访问原生 DOM 事件对象时，可以通过合成事件对象的 **e.nativeEvent** 属性获取到它

**React 事件系统设计动机**

- 合成事件是 React 自定义的事件对象，它符合W3C规范，**在底层抹平了不同浏览器的差异，在上层面向开发者暴露统一的、稳定的、与 DOM 原生事件相同的事件接口。**开发者们由此便不必再关注烦琐的兼容性问题，可以专注于业务逻辑的开发。
- 自研事件系统使 React 牢牢把握住了事件处理的主动权：这一点其实和我们平时造轮子是一样的。我在牵头自研团队前端框架之前，首先问自己的问题也是“为什么需要自研？React 不好用吗？Vue 不香吗？”。**我们造轮子，很多时候并不是因为别人家的轮子不好，而是因为别人家的轮子没有办法 Match 我们的场景**。拿 React 来说，举两个大家都比较熟悉的例子，比如说它想在事件系统中处理 Fiber 相关的优先级概念，或者想把多个事件揉成一个事件（比如 onChange 事件），原生 DOM 会帮它做吗？不会，因为原生讲究的就是个通用性。而 React 想要的则是“量体裁衣”，通过自研事件系统，React 能够从很大程度上干预事件的表现，使其符合自身的需求。

## 事件注册



![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/blog/%E4%BA%8B%E4%BB%B6%E6%B3%A8%E5%86%8C.png)



- 组件装载 / 更新。
- 通过`lastProps`、`nextProps`判断是否新增、删除事件分别调用事件注册、卸载方法。
- 调用`EventPluginHub`的`enqueuePutListener`进行事件存储
- 获取`document`对象。
- 根据事件名称（如`onClick`、`onCaptureClick`）判断是进行冒泡还是捕获。
- 判断是否存在`addEventListener`方法，否则使用`attachEvent`（兼容IE）。
- 给`document`注册原生事件回调为`dispatchEvent`（统一的事件分发机制）。

## 事件存储



![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/blog/%E4%BA%8B%E4%BB%B6%E5%AD%98%E5%82%A8.png)



- `EventPluginHub`负责管理React合成事件的`callback`，它将`callback`存储在`listenerBank`中，另外还存储了负责合成事件的`Plugin`。
- `EventPluginHub`的`putListener`方法是向存储容器中增加一个listener。
- 获取绑定事件的元素的唯一标识`key`。
- 将`callback`根据事件类型，元素的唯一标识`key`存储在`listenerBank`中。
- `listenerBank`的结构是：`listenerBank[registrationName][key]`。

例如：

```js
{
    onClick:{
        nodeid1:()=>{...}
        nodeid2:()=>{...}
    },
    onChange:{
        nodeid3:()=>{...}
        nodeid4:()=>{...}
    }
}
```

## 事件触发 / 执行



![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/blog/%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91.png)



这里的事件执行利用了`React`的批处理机制，在前一篇的[【React深入】setState的执行机制](https://juejin.im/post/1)中已经分析过，这里不再多加分析。

- 触发`document`注册原生事件的回调`dispatchEvent`
- 获取到触发这个事件最深一级的元素

例如下面的代码：首先会获取到`this.child`

```jsx
      <div onClick={this.parentClick} ref={ref => this.parent = ref}>
        <div onClick={this.childClick} ref={ref => this.child = ref}>
          test
        </div>
      </div>
```

- 遍历这个元素的所有父元素，依次对每一级元素进行处理。
- 构造合成事件。
- 将每一级的合成事件存储在`eventQueue`事件队列中。
- 遍历`eventQueue`。
- 通过`isPropagationStopped`判断当前事件是否执行了阻止冒泡方法。
- 如果阻止了冒泡，停止遍历，否则通过`executeDispatch`执行合成事件。
- 释放处理完成的事件。

`react`在自己的合成事件中重写了`stopPropagation`方法，将`isPropagationStopped`设置为`true`，然后在遍历每一级事件的过程中根据此遍历判断是否继续执行。这就是`react`自己实现的冒泡机制。

## 合成事件



![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/blog/%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6.png)



- 调用`EventPluginHub`的`extractEvents`方法。
- 循环所有类型的`EventPlugin`（用来处理不同事件的工具方法）。
- 在每个`EventPlugin`中根据不同的事件类型，返回不同的事件池。
- 在事件池中取出合成事件，如果事件池是空的，那么创建一个新的。
- 根据元素`nodeid`(唯一标识`key`)和事件类型从`listenerBink`中取出回调函数
- 返回带有合成事件参数的回调函数

### 总流程

将上面的四个流程串联起来。



![image](https://lsqimg-1257917459.cos-website.ap-beijing.myqcloud.com/blog/react%E4%BA%8B%E4%BB%B6%E6%9C%BA%E5%88%B6.png)



## 为什么要手动绑定this

通过事件触发过程的分析，`dispatchEvent`调用了`invokeGuardedCallback`方法。

```js
function invokeGuardedCallback(name, func, a) {
  try {
    func(a);
  } catch (x) {
    if (caughtError === null) {
      caughtError = x;
    }
  }
}
```

可见，回调函数是直接调用调用的，并没有指定调用的组件，所以不进行手动绑定的情况下直接获取到的`this`是`undefined`。

这里可以使用实验性的[属性初始化语法](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) ，也就是直接在组件声明箭头函数。箭头函数不会创建自己的`this`，它只会从自己的作用域链的上一层继承`this`。因此这样我们在`React`事件中获取到的就是组件本身了。

## 和原生事件有什么区别

- `React` 事件使用驼峰命名，而不是全部小写。
- 通过 `JSX` , 你传递一个函数作为事件处理程序，而不是一个字符串。

例如，`HTML`：

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

在 `React` 中略有不同：

```jsx
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

另一个区别是，在 React 中你不能通过返回`false` 来阻止默认行为。必须明确调用 `preventDefault`。

由上面执行机制我们可以得出：`React`自己实现了一套事件机制，自己模拟了事件冒泡和捕获的过程，采用了事件代理，批量更新等方法，并且抹平了各个浏览器的兼容性问题。

## `React`事件和原生事件的执行顺序

```jsx
  componentDidMount() {
    this.parent.addEventListener('click', (e) => {
      console.log('dom parent');
    })
    this.child.addEventListener('click', (e) => {
      console.log('dom child');
    })
    document.addEventListener('click', (e) => {
      console.log('document');
    })
  }

  childClick = (e) => {
    console.log('react child');
  }

  parentClick = (e) => {
    console.log('react parent');
  }

  render() {
    return (
      <div onClick={this.parentClick} ref={ref => this.parent = ref}>
        <div onClick={this.childClick} ref={ref => this.child = ref}>
          test
        </div>
      </div>)
  }
```

执行结果：



![image](https://user-gold-cdn.xitu.io/2019/3/5/1694bfcc998355f5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



由上面的流程我们可以理解：

- `react`的所有事件都挂载在`document`中
- 当真实dom触发后冒泡到`document`后才会对`react`事件进行处理
- 所以原生的事件会先执行
- 然后执行`react`合成事件
- 最后执行真正在`document`上挂载的事件

# react事件和原生事件可以混用吗？

`react`事件和原生事件最好不要混用。

原生事件中如果执行了`stopPropagation`方法，则会导致其他`react`事件失效。因为所有元素的事件将无法冒泡到`document`上。

由上面的执行机制不难得出，所有的react事件都将无法被注册。

## 合成事件、浏览器兼容

```js
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }
```

> 这里， `e` 是一个合成的事件。 `React` 根据[ W3C ](https://www.w3.org/TR/DOM-Level-3-Events/)规范 定义了这个合成事件，所以你不需要担心跨浏览器的兼容性问题。

事件处理程序将传递 `SyntheticEvent` 的实例，这是一个跨浏览器原生事件包装器。 它具有与浏览器原生事件相同的接口，包括`stopPropagation()` 和 `preventDefault()` ，在所有浏览器中他们工作方式都相同。

每个`SyntheticEvent`对象都具有以下属性：

```js
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

`React`合成的`SyntheticEvent`采用了事件池，这样做可以大大节省内存，而不会频繁的创建和销毁事件对象。

另外，不管在什么浏览器环境下，浏览器会将该事件类型统一创建为合成事件，从而达到了浏览器兼容的目的。