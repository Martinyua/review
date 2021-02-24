# React

## 基本使用

### JSX

* 变量，表达式
* class，style
* 条件判断
  * if else
  * 三元表达式
  * &&
* 列表渲染
  * map
  * key

### 事件

* bind this
  * constructor中绑定
  * 标签中绑定
  * 箭头函数，this默认指向当前实例
* event参数
  * 并非是原生event，是React封装后的SyntheticEvent，模拟所有DOM事件的能力
  * **event.nativeEvent**拿到原生事件对象，event.nativeEvent.currentTarget
  * **所有的事件，都被挂载(绑定）到document**，和DOM事件不一样
  * 箭头函数，e这个参数代表的React事件需要通过最后一个函数传递过去，bind语法e会自动传入
* 自定义参数传递

### State为不可变值

* 第一，state 要在构造函数中定义
* 对于基本数据类型，不要直接改变state的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ，如this.state.count++ // 错误
* 对数组使用**concat**，**拓展运算符**，**splice**可以先拷贝一个副本。对于对象可以使用**拓展运算符**，**Object.assgin()**

### setSate

* **不可变值**

  * **不能直接修改 state的值**

  * 不要直接使用push，pop，splice等会改变原来state的方法，对数组使用**concat**，**拓展运算符**，**splice**可以先拷贝一个副本

  * 对于对象可以使用**拓展运算符**，**Object.assgin()**

* **异步更新**
  * 通常不能直接拿到最新的值
  * 通过setState的第二个参数传入回调函数拿到最新值
  * **setTimeout**中的是**同步**的
  * **自己的定义的DOM事件**，setState也是同步的（自定义的dom事件需要在卸载时销毁removeEventListener）
* **合并**
  * setState传入对象，会被合并
  * setState传入函数，不会被合并

### 父子组件传值

* 父组件传给子组件：通过props
* 子组件传给父组件：通过调用父组件传过来的方法，并且调用方法传入参数
* 状态提升：将子组件的数据提升值父组件，方便管理

### 生命周期

[参考](https://github.com/sisterAn/blog/issues/34)

16.4后

* 挂载 
  * constructor
  * getDerivedStateFromProps
  * render
  * componentDidMount

* 更新 
  * getDerivedStateFromProps
  * shouldComponentUpdate
  * render
  * getSnapshotBeforeUpdate
  * componentDidUpdate

* 卸载 
  * componentWillUnmount

* 父子组件生命周期
  * 挂载：
    * 第一阶段：父组件开始执行自己的render，对其中的同步子组件进行创建，然后**递归排序**执行各个子组件的render，生成到父组件的Virtual DOM（先父后子）
    * 第二阶段：DOM节点生成完毕，先触发子组件的componentDidMount，再触发父组件的
    * 异步子组件，会在父组件挂载完成后被创建。
  * 更新：
    * 第一阶段：父组件开始执行`static getDerivedStateFromProps` `shouldComponentUpdate`，更新至自己的render。然后子组件更新至自己的render。
      第二阶段：先依次触发同步子组件以下函数，最后触发父组件的。
      1. `getSnapshotBeforeUpdate()`
      2. `componentDidUpdate()`

### Ref

* 必须手动操作dom，setState实现不了，使用ref操控dom元素

* 比如文件上传，富文本编辑器，需要传入dom元素

* 使用

* 非受控组件：不能通过state来改变

* > 在大多数情况下，我们推荐使用 [受控组件](https://zh-hans.reactjs.org/docs/forms.html#controlled-components) 来处理表单数据。在一个受控组件中，表单数据是由 React 组件来管理的。另一种替代方案是使用非受控组件，这时表单数据将交由 DOM 节点来处理。

  ```js
  this.nameInputRef = React.createRef() // 创建 ref
  this.fileInputRef = React.createRef()
  {/* 使用 defaultValue 而不是 value ，使用 ref */}
  <input defaultValue={this.state.name} ref={this.nameInputRef}/> //绑定
  <input type="file" ref={this.fileInputRef}/> //文件上传
  const elem = this.nameInputRef.current  //获取dom元素
  ```

### Portals

* 组件默认会按照既定层次嵌套渲染

* 解决如何让组件渲染到父组件以外

* 使用`ReactDOM.createPortal`(不会改变组件结构)

  ```js
  return ReactDOM.createPortal(
      <div className="modal">{this.props.children}</div>,
      document.body // DOM 节点
  )
  ```

* 使用场景（解决一些css兼容问题）

  * overflow：hidden。父组件bfc，会限制子组件的展示，让子组件逃离父组件
  * 父组件z-index太小
  * flex需要放在body的第一层级

### lazy和suspense 

* 异步组件，当组件比较大的时候懒加载使用，性能优化

* 使用

  ```js
  import {Suspense} from 'react
  const ContextDemo = React.lazy(() => import('./ContextDemo'))
  <Suspense fallback={<div>Loading...</div>}>
     <ContextDemo/>
  </Suspense>
  ```

  

### SCU

* shouldComponentUpdate(nextProps,nextState){} //接下来的Props和State。默认return true

* 使用

  ```js
  shouldCompoentUpdate(nextProps,nextState) {
      if(nextState.count !== this.state.count){
          return true
      }
      	return false
  }
  ```

* 为什么需要SCU

  * React默认父组件更新，子组件无条件更新，某些组件可能重复渲染
  * 为什么React不默认采用？ ——假如开发者未采用**不可变值**，**则会出现bug**，因为此时的nextState和this.state始终相等。比如数组需要加入数据的时候使用了push,即便是使用 = 来赋值，因为是引用同一个地址，所以两个数组都发生了改变。
  * 采用不可变值
    * 可以

### PureComponent和memo

* SCU中实现了浅比较，即对state和props进行**浅比较**（只比较第一层），深比较比较耗费性能
* memo，函数组件中的PureComponent。React.memo为高阶组件

* 使用。将组件包裹在React.memo中调用

  ```js
  const MyComponent = React.memo(function MyComponent(props) {
    /* 使用 props 渲染 */
  });
  ```

* `React.memo` 仅检查 **props** 变更

* memo默认浅比较，如需要深比较，**需要自定义比较函数通过第二个参数传入**

  ```
  export default React.memo(MyComponent, areEqual)
  ```

* 浅比较实际上只是比较了两个对象的key以及基本类型的value，如果嵌套比较深的对象就不行了。如果第一层数据没变，但是引用发生了改变，会造成不渲染的bug，所以需要小心操作数据

### immutable

* **概述**：immutable data就是一创建，就**不能再被更改的数据**，对immutable对象的任何修改，添加和删除的操作都将**会返回一个新的immutable对象**。immutable只是把修改的节点复制一份，其余的部分共享
* ![immutable](https://segmentfault.com/img/bVsXeZ)
* **为什么需要**？ ——当有**多个方法都可以修改数据时**，假如用的时候出现了bug，将会带来**不可控的结果**。导致**不稳定**。而一般的解法为**深拷贝**，生成一份基本类型完全相同但是 没有共享的数据地址，除了**浪费内存**，深拷贝需要深度遍历，在React这种对数据频繁更新和对数据更新**性能**有要求的场景，深拷贝极不优雅。
* **优点：**
  * 降低Mutable带来的复杂度（若数据发生改变的话，就需要进行一次深拷贝，导致内存消耗大，性能低）
  * 节省内存空间
  * 拥抱函数式编程

### Immer.js

* ```
  *概述
  currentState
  被操作对象的最初状态
  
  draftState
  根据 currentState 生成的草稿状态，它是 currentState 的代理，对 draftState 所做的任何修改都将被记录并用于生成 nextState 。在此过程中，currentState 将不受影响
  
  nextState
  根据 draftState 生成的最终状态
  
  produce 生产
  用来生成 nextState 或 producer 的函数
  
  producer 生产者
  通过 produce 生成，用来生产 nextState ，每次执行相同的操作
  
  recipe 生产机器
  用来操作 draftState 的函数
  
  let nextState = produce(currentState, (draftState) => {
  
  })
  
  currentState === nextState; // true
  ```

* 冻结：通过 produce 生成的 **nextState** 是被**冻结**（freeze）的 (Immer 内部使用`Object.freeze`方法). 这使得 nextState 成为了真正的不可变数据。

* **使用immer更新state**

  ```
  this.setState(produce(draftState => {
    draftState.members[0].age++;
  }))
  ```

  

* **使用immer更新reducer**

  ```js
  const reducer = produce((draftState, action) => {
    switch (action.type) {
      case 'ADD_AGE':
        draftState.members[0].age++;
    }
  })
  ```

  

* 对于嵌套比较深的引用类型，操作更加简单，易读

### VDOM（虚拟dom）和diff

* 背景
  * DOM操作非常耗费性能
  * React是数据驱动视图，需要高效的操作DOM
* 概述
  * VDOM用JS模拟DOM结构，计算出最小的变更，操作DOM，因为JS执行速度更快
  * 例如使用JS对象模拟树形结构，tag模拟标签名，props模拟属性，children数组模拟子节点
  * ![1606981354348](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1606981354348.png)![1606981433110](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1606981433110.png)
* diff算法是vdom中最核心，关键的部分，（key）
  * 树的diff算法一般为O(n^3)，不可用
  * 优化后的diff算法O(n)
    * **只比较相同层级，不跨级比较**
    * **tag不相同，则直接删除重建，不再进行深度比较**
    * **tag和key相同，则认为是相同节点，不再进行深度比较**





