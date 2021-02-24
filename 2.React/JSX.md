### JSX

- 在被编译时会被编译为React.createElement。

JSX和FIber节点的区别：**JSX是描述当前组件内容的一种数据结构**，**他不包含schedule，reconcile，render的所需相关信息**。比如组件更新的优先级，组件的state，被打上的render信息。

所以，在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。在`update`时，`Reconciler`将`JSX`与`Fiber节点`保存的数据对比，生成组件对应的`Fiber节点`，并根据对比结果为`Fiber节点`打上`标记`

