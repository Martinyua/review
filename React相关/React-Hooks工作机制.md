>  React-Hooks 的使用原则：
>
> - 只在 React 函数中调用 Hook
> - 不要在循环、条件或嵌套函数中调用 Hook

原则 1 无须多言，React-Hooks 本身就是 React 组件的“钩子”，在普通函数里引入意义不大。对于原则2，都是在指向同一个目的，那就是**要确保 Hooks 在每次渲染时都保持同样的执行顺序**。

为什么顺序如此重要？这要从 React-Hooks 的实现机制说起。以下以 useState 为例。

### 从现象看问题：若不保证 Hooks 执行顺序，会带来什么麻烦

```jsx
import React, { useState } from "react";

let isMounted = false;

function PersonalInfoComponent() {
  let name, age, career, setName, setCareer;
    
  console.log("isMounted is", isMounted);

  if (!isMounted) {
    // eslint-disable-next-line
    [name, setName] = useState("修言");
    // eslint-disable-next-line
    [age] = useState("99");
      
    isMounted = true;
  }
  [career, setCareer] = useState("前端");

  console.log("career", career);

  return (
    <div className="personalInfo">
      {name ? <p>姓名：{name}</p> : null}
      {age ? <p>年龄：{age}</p> : null}
      <p>职业：{career}</p>
      <button
        onClick={() => {
          setName("秀妍");
        }}
      >
        修改姓名
      </button>
    </div>
  );
}
export default PersonalInfoComponent;
```

上面例子中，在条件语句中调用了 useState，组件在首次渲染的时候，没有问题。但当点击按钮的时候就会发生错误：“**组件渲染的 Hooks 比期望中更少**”。

点击按钮后，console 输出

```js
isMounted is true
career 秀妍
```

isMounted 为 true 是正确的，但career为秀妍显然不对。

### 从源码调用流程看原理：Hooks的正常运作，在底层依赖于顺序链表

> **Hooks 的本质其实是链表**。

**以 useState 为例，分析 React-Hooks 的调用链路**

React-Hooks 的调用链路在首次渲染和更新阶段是不同的。

**首次渲染过程**

![图片12.png](https://s0.lgstatic.com/i/image/M00/67/59/Ciqc1F-hJYCAWVjCAAEtNT9pGHA170.png)

在这个流程中，useState 触发的一系列操作最后会落到 **mountState** 里面去，所以我们重点需要关注的就是 mountState 做了什么事情。

```js
function mountState(initialState) {
  // 将新的 hook 对象追加进链表尾部
  var hook = mountWorkInProgressHook();
  // initialState 可以是一个回调，若是回调，则取回调执行后的值
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  // 创建当前 hook 对象的更新队列，这一步主要是为了能够依序保留 dispatch
  const queue = hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  // 将 initialState 作为一个“记忆值”存下来
  hook.memoizedState = hook.baseState = initialState;
  // dispatch 是由上下文中一个叫 dispatchAction 的方法创建的，这里不必纠结这个方法具体做了什么
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
  // 返回目标数组，dispatch 其实就是示例中常常见到的 setXXX 这个函数
  return [hook.memoizedState, dispatch];
}
```

从这段源码中我们可以看出，**mounState 的主要工作是初始化 Hooks**。在整段源码中，最需要关注的是 mountWorkInProgressHook 方法，它为我们道出了 Hooks 背后的数据结构组织形式。以下是 **mountWorkInProgressHook** 方法的源码：

```js
function mountWorkInProgressHook() {
  // 注意，单个 hook 是以对象的形式存在的
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  if (workInProgressHook === null) {
    // 这行代码每个 React 版本不太一样，但做的都是同一件事：将 hook 作为链表的头节点处理
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // 若链表不为空，则将 hook 追加到链表尾部
    workInProgressHook = workInProgressHook.next = hook;
  }
  // 返回当前的 hook
  return workInProgressHook;
}
```

到这里可以看出，**hook 相关的所有信息收敛在一个 hook 对象里，而 hook 对象之间以单向链表的形式相互串联**。

**更新过程**

![图片13.png](https://s0.lgstatic.com/i/image/M00/67/59/Ciqc1F-hJTGANs5yAAD4e6ACv8Q643.png)

首次渲染和更新渲染的区别，在于调用的是 mountState，还是 updateState。 updateState 之后的操作链路，虽然涉及的代码有很多，但其实做的事情很容易理解：**按顺序去遍历之前构建好的链表，取出对应的数据信息进行渲染**。

即：mountState（首次渲染）构建链表并渲染；updateState 依次遍历链表并渲染。

**hooks 的渲染是通过“依次遍历”来定位每个 hooks 内容的。如果前后两次读到的链表在顺序上出现差异，那么渲染的结果自然是不可控的**。

