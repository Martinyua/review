> React 的核心特性是**数据驱动视图**，即`UI=render(data)`，意思是**React 的视图会随着数据的变化而变化**。
>
> 在React中，如果A组件希望通过某种方式影响到B组件，那么这两个组件必须先建立数据上的连接，以实现所谓的 “组件间通信”。

## 基于 props 的单向数据流

> 组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即“props”）并返回用于描述页面展示内容的 React 元素。  ——props

**单向数据流**：指的就是当前组件的 state 以 props 的形式流动时，**只能流向组件树中比自己层级更低的组件**。

### 父-子组件通信

React 的数据流是单向的，父组件可以直接将 this.props 传入子组件，实现父-子间的通信。

父组件通过在子组件上添加属性，子组件通过props引用。

### 子-父组件通信

props 是单向的，子组件并不能直接将自己的数据塞给父组件，但父组件可以将一个**绑定了自身上下文的函数**传递给子组件，那么子组件在调用该函数时，就可以**将想要交给父组件的数据以函数入参的形式给出去**，以此来间接地实现数据从子组件到父组件的流动。

### 兄弟组件通信

兄弟组件之间共享了同一个父组件。我们可以将兄弟组件间的通信转化为 先子-父后父-子 的方式。

props并不能很好的解决一些复杂的场景，比如父组件需要和层级较深的子组件通信时，需要层层传递props，这样不仅代码臃肿繁琐，而且维护成本也会增加，因此需要使用其他的通信方式。

## 利用 ”发布-订阅“ 模式驱动数据流

### 理解事件的发布订阅机制

发布-订阅机制早期最广泛的应用应该是在浏览器的 DOM 事件中。如：

```js
target.addEventListener(type, listener, useCapture)
```

通过调用 addEventListener 方法，我们可以创建一个事件监听器，这个动作就是“**订阅**”。比如可以监听click事件：

```js
el.addEventListener("click", func, false)
```

当 click 事件被触发时，事件会被“**发布**”出去，进而触发监听这个事件的 func 函数。这就是一个最简单的发布-订阅案例。

使用发布-订阅模式的优点在于，**监听事件的位置和触发事件的位置是不受限的**，这个特性非常适用于 ”任意组件通信“。

### 发布-订阅模型 API 设计思路

两个关键动作：**事件的监听（订阅）和事件的触发（发布）**

- on()：负责册事件的监听器，指定事件触发时的回调函数。
- emit()：负责触发事件，可以通过传参使其在触发的时候携带数据 。
- off()：负责监听器的删除

### 编码实现

```js
class myEventEmitter {
  constructor() {
    // eventMap 用来存储事件和监听函数之间的关系(映射)
    this.eventMap = {};
  }
  // type 这里就代表事件的名称
  on(type, handler) {
    // hanlder 必须是一个函数，如果不是直接报错
    if (!(handler instanceof Function)) {
      throw new Error("哥 你错了 请传一个函数");
    }
    // 判断 type 事件对应的队列是否存在
    if (!this.eventMap[type]) {
      // 若不存在，新建该队列
      this.eventMap[type] = [];
    }
    // 若存在，直接往队列里推入 handler
    this.eventMap[type].push(handler);
  }
  // 别忘了我们前面说过触发时是可以携带数据的，params 就是数据的载体
  emit(type, params) {
    // 假设该事件是有订阅的（对应的事件队列存在）
    if (this.eventMap[type]) {
      // 将事件队列里的 handler 依次执行出队
      this.eventMap[type].forEach((handler, index) => {
        // 注意别忘了读取 params
        handler(params);
      });
    }
  }
  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
    }
  }
}
```

测试例子：

```jsx
// 实例化 myEventEmitter
const myEvent = new myEventEmitter();
// 编写一个简单的 handler
const testHandler = function (params) {
  console.log(`test事件被触发了，testHandler 接收到的入参是${params}`);
};
// 监听 test 事件
myEvent.on("test", testHandler);
// 在触发 test 事件的同时，传入希望 testHandler 感知的参数
myEvent.emit("test", "newState"); //test事件被触发了...
```

对于任意两个组件A和B，希望双方通信，以数据从A流向B为例，可以在B中编写一个handler（在其中进行setState操作），然后将这个handler作为监听器与某个事件关联。接下来在A组件中，只需要触发对应的事件，然然后将希望携带给 B 的数据作为入参传递给 emit 方法即可。

例子：

```jsx
//B组件
class B extends React.Component {
  // ....
  state = {newParams: ""};
  handler = (params) => {
    this.setState({
      newParams: params
    });
  };
  bindHandler = () => {
    globalEvent.on("someEvent", this.handler);
  };
  render() {
    return (
      <div>
        <button onClick={this.bindHandler}>点我监听A的动作</button>
        <div>A传入的内容是[{this.state.newParams}]</div>
      </div>
    );
  }
}

//A组件
class A extends React.Component {
  // 这里省略掉其他业务逻辑
  state = {
    infoToB: "哈哈哈哈我来自A"
  };
  reportToB = () => {
    // 这里的 infoToB 表示 A 自身状态中需要让 B 感知的那部分数据
    globalEvent.emit("someEvent", this.state.infoToB);
  };
  render() {
    return <button onClick={this.reportToB}>点我把state传递给B</button>;
  }
}
//假设两者为兄弟组件
export default function App() {
  return (
    <div className="App">
      <B />
      <A />
    </div>
  );
}
```

## 使用 Context API 维护全局状态

> Context API 是 React 官方提供的一种组件树全局通信的方式。

### 三要素

- `React.createContext`，创建一个 context 对象。

  ```js
  const AppContext = React.createContext(defaultValue) //默认值可不传
  const { Provider, Context } = AppContext
  ```

  从创建出的 context 对象中，可以读取到 Provider 和 Consumer。

- Provider，可以理解为 “数据的 Provider（提供者）”

  使用 Provider 对组件树中的跟组件进行包裹，传入名为“value”的属性，这个 value 就是后续在组件树中流动的“数据”，它可以被 Consumer 消费。

  ```jsx
  <Provider value={title: this.state.title, content: this.state.content}>
    <Title />
    <Content />
  </Provider>
  ```

- Consumer，即 ”数据的消费者“，它可以读取 Provider 下发下来的数据。

  需要接收一个函数作为子元素，这个函数需要返回一个组件。

  ```jsx
  <Consumer>
    {value => <div>{value.title}</div>}
  </Consumer>
  //或者
  static contextType = AppContext;
  let title = this.context;
  <div>this.</div>
  ```

### 新旧 Context API

**过时的 Context API 的缺陷**

- [过时的 Context](https://zh-hans.reactjs.org/docs/legacy-context.html)文档
- 代码不够优雅
- 如果组件提供的一个Context发生了变化，而中间父组件的 shouldComponentUpdate 返回 false，**那么使用到该值的后代组件不会进行更新**。使用了 Context 的组件则完全失控，所以基本上没有办法能够可靠的更新 Context。

**新的Context Api**

- 新的 Context API 的改进：**即便组件的 shouldComponentUpdate 返回 false，它仍然可以“穿透”组件继续向后代组件进行传播**，**进而确保了数据生产者和数据消费者之间数据的一致性**。

## 第三方数据流框架的 ”代表“：Redux

> Redux 是 JavaScript 状态容器，它提供可预测的状态管理。

**三个概念**

- store，**一个单一的数据源**，只读
- action，”动作“，**对变化的描述**
- reducer，一个函数，**对变化进行分发和处理**，最终将新的数据返回给 store

**在 Redux 整个工作过程中，数据流是严格单向的**。

- 对于一个React应用来说，视图(View)层面的所有数据（state）都来自 store。
- 如果相对数据进行修改，只能通过派发 action。action会被reducer读取，进而根据 action 的内容的不同对数据进行修改、生成新的 state（状态），这个新的 state 会更新到store对象中，进而驱动视图层面做出相应的改变。
- 对于组件来说，任何组件都可以通过约定的方式从 store 读取到全局的状态，任何组件也都可以通过合理地派发 action 来修改全局的状态。**Redux 通过提供一个统一的状态容器，使得数据能够自由而有序地在任意组件之间穿梭**，这就是 Redux 实现组件间通信的思路。