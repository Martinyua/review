## ReactDOM.render渲染流程

![Drawing 4.png](https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmGKAFb5NAAItD2ouVoc061.png)

以`scheduleUpdateOnFiber`（调度更新）和`commitRoot`两个方法为界，大致可以把ReactDOM.render的调用栈分为三个阶段：

- 初始化阶段
- render阶段
- commit阶段

### 初始化阶段

> 完成Fiber树中的**基本实体**的创建。

首先是 **legacyRenderSubtreeIntoContainer** 方法，在 **ReactDOM.render** 函数体中，这样调用了它：

```js
return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
```

 **legacyRenderSubtreeIntoContainer**关键逻辑：

![Lark20201120-182606.png](https://s0.lgstatic.com/i/image/M00/70/03/CgqCHl-3mfWABLi5AADUzMV7iHA320.png)

**fiberRoot**

![Drawing 6.png](https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmH6AKzPPAADcEbfK6K4199.png)

可以看出，root 对象（container._reactRootContainer）上有一个 _internalRoot 属性，这个 _internalRoot 也就是 fiberRoot。fiberRoot 的本质是一个 **FiberRootNode** 对象，其中包含一个 **current** 属性：

![Drawing 7.png](https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmISANlmfAADLqX8jue0154.png)

current 对象(**rootFiber**)是一个 FiberNode 实例，**而 FiberNode，正是 Fiber 节点对应的对象类型**。current 对象是一个 Fiber 节点，不仅如此，它还是**当前 Fiber 树的头部节点**。

指向关系：

![Lark20201120-182610.png](https://s0.lgstatic.com/i/image/M00/6F/F8/Ciqc1F-3mh-AZrlvAABgy8S1u44402.png)

其中，fiberRoot 的关联对象是真实 DOM 的容器节点；而 rootFiber 则作为虚拟 DOM 的根节点存在。**这两个节点，将是后续整棵 Fiber 树构建的起点**。

