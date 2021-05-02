## React-Hooks设计动机和工作模式

### 类组件与函数组件

> Dan大神写的，你确定不看？[函数组件与类组件有何不同？](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)

**类组件**：基于ES6 Class 这种写法，通过继承 React.Component 得来的 React 组件。类组件是面向对象编程思想的一种表征。

**函数组件/无状态组件**：以**函数的形态**存在的 React 组件，早期没有React-Hooks加持，函数组件内部无法定义和维护 state，因此也叫做“无状态组件”。

**函数组件与类组件的对比**

- 类组件需要继承 class，函数组件不需要；
- 类组件可以访问生命周期方法，函数组件不能；
- 类组件中可以获取到实例化后的 this，并基于这个 this 做各种各样的事情，而函数组件不可以；
- 类组件中可以定义并维护 state（状态），而函数组件不可以；
- 同样逻辑的函数组件相比类组件而言，复杂度要低得多得多。【引入hooks】
- …

在 React-Hooks 出现之前的世界里，**类组件的能力边界明显强于函数组件**，当然并不能说类组件强于函数组件。

> **函数组件会捕获 render 内部的状态，这是两类组件最大的不同**。

**类组件和函数组件之间，纵有千差万别，但最不能够被我们忽视掉的，是心智模式层面的差异**，是面向对象和函数式编程这两套不同的设计思想之间的差异。

说得更具体一点，**函数组件更加契合 React 框架的设计理念。**即**UI=render(data)**。

不夸张地说，**React 组件本身的定位就是函数，一个吃进数据、吐出 UI 的函数**。作为开发者，我们编写的是声明式的代码，而 React 框架的主要工作，就是**及时地把声明式的代码转换为命令式的 DOM 操作，把数据层面的描述映射到用户可见的 UI 变化中去**。这就意味着从原则上来讲，**React 的数据应该总是紧紧地和渲染绑定在一起的，而类组件做不到这一点**。【[例子](https://codesandbox.io/s/pjqnl16lm7?file=/src/ProfilePageClass.js)】

**函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式**。

### 动机

> React-Hooks本质上是一套能够使函数组件更强大、更灵活的“钩子”。
>
> 官方文档写的动机，你确定不看？[动机](https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation)

Hook 解决了我们五年来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题。

#### 在组件之间复用状态逻辑很难

React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）。可以使用[render props](https://zh-hans.reactjs.org/docs/render-props.html) 和 [高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)这些设计模式。但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。如果你在 React DevTools 中观察过 React 应用，你会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。尽管我们可以[在 DevTools 过滤掉它们](https://github.com/facebook/react-devtools/pull/503)，但这说明了一个更深层次的问题：React 需要为共享状态逻辑提供更好的原生途径。

你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。**Hook 使你在无需修改组件结构的情况下复用状态逻辑。** 

#### 复杂组件变得难以理解

我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据。但是，同一个 `componentDidMount` 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 `componentWillUnmount` 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。

为了解决这个问题，**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

在 Hooks 的帮助下，我们完全可以把这些繁杂的操作**按照逻辑上的关联拆分进不同的函数组件里：我们可以有专门管理订阅的函数组件、专门处理 DOM 的函数组件、专门获取数据的函数组件等。Hooks 能够帮助我们实现业务逻辑的聚合，避免复杂的组件和冗余的代码**。

#### 难以理解的 class

你必须去理解 JavaScript 中 `this` 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的[语法提案](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)，这些代码非常冗余。

使用 class 组件会无意中鼓励开发者使用一些让优化措施无效的方案。class 也给目前的工具带来了一些问题。例如，class 不能很好的压缩，并且会使热重载出现不稳定的情况。因此，我们想提供一个使代码更易于优化的 API。

为了解决这些问题，**Hook 使你在非 class 的情况下可以使用更多的 React 特性。** 从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术。

#### 函数组件从设计思想上看来，更加契合 React 的理念

### hooks局限性



### 从核心API看Hooks的基本形态

#### useState()：为函数组件引入形态

早期函数组件一大劣势是缺乏定义和维护state的能力，而 state（状态）作为 React 组件的灵魂，必然是不可省略的。

语法：`const [state, setState] = useState(initialState);`

当我们在函数组件中调用 React.useState 的时候，实际上是给这个组件关联了**一个状态**。这是相对类组件而言的，类组件整个组件的状态都在 state 对象内部做收敛，当我们需要某个具体状态的时候，会通过 this.state.xxx 这样的访问对象属性的形式来读取它。

#### useEffect()：**允许函数执行副作用操作**

语法：`useEffect(callBack, [])`

- 每次渲染后都执行副作用：`useEffect(callback)`

- 仅在挂载阶段执行一次副作用，callback返回值不是一个函数

  ```js
  useEffect(()=>{
    // 这里是业务逻辑
  }, [])
  ```

- 仅在挂载阶段和卸载阶段执行的副作用，callback返回值是一个函数

  ```js
  useEffect(()=>{
    // 这里是 A 的业务逻辑
    // 返回一个函数记为 B
    return ()=>{ //清除函数
    }
  }, [])
  ```

- 每一次渲染都触发，且卸载阶段也会被触发的副作用

  ```js
  useEffect(()=>{
    // 这里是 A 的业务逻辑
    // 返回一个函数记为 B
    return ()=>{
    }
  })
  ```

- 根据一定的依赖条件来触发的副作用

  ```js
  useEffect(()=>{
    // 这是回调函数的业务逻辑 
    // 若 xxx 是一个函数，则 xxx 会在组件卸载时被触发
    return xxx
  }, [num1, num2, num3])
  ```

  【说明】：数组中的变量一般都是来源于组件本身的数据（props 或者 state）。若数组不为空，那么 React 就会在新的一次渲染后去对比前后两次的渲染，查看数组内是否有变量发生了更新（只要有一个数组元素变了，就会被认为更新发生了），并在有更新的前提下去触发 useEffect 中定义的副作用逻辑。

#### useaContext()：让父子组件传值更简单

```jsx
const MyContext = createContext();
function App(){
    const [val, setVal] = useState(0);
    return (
    	<MyContext.Provider>
        	<Context />
        </MyContext.Provider>
    )
}

function Context(){
    let val = useContext(MyContext);
    return (
    	<div>{val}</div>
    )
}
```

- `useContext`对象接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。
- 调用了 `useContext` 的组件总会在 context 值变化时重新渲染。

#### useReducer()

**语法**

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

- `useState`的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。

**例子**

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### 使用 useReducer 和 useContext 模拟 redux

```jsx
import React,{ useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';

function App(){
  return(
    <Color>
      <ShowColor />
      <Button />
    </Color>
  )
}
const ColorContext = React.createContext({});

const UPDATE_COLOR = 'UPDATE_COLOR'

const reducer = (state, action)=>{
  switch(action.type){
    case UPDATE_COLOR:
      return action.color;
    default: 
      return state;
  }
}


function Color(props){
  const [color, dispatch] = useReducer(reducer, 'blue');
  return(
    <ColorContext.Provider value={{color, dispatch}}>
      {props.children}
    </ColorContext.Provider>
  )
}

function ShowColor(){
  let {color} = useContext(ColorContext);
  return (
    <div>颜色是{color}</div>
  )
}
function Button(){
  const {dispatch} = useContext(ColorContext);
  return(<>
    <button onClick={()=>{dispatch({type:UPDATE_COLOR, color:"red"})}}>红色</button>
    <button onClick={()=>{dispatch({type:UPDATE_COLOR, color:"green"})}}>绿色</button>
  </>)
}

ReactDOM.render(<App /> ,document.getElementById('root'))
```

#### useMemo: 优化程序性能

**语法**

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a,b), [a,b ])
```

- 把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

#### useCallback

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

#### useRef：获取DOM元素和保存变量

- **获取DOM**

  ```jsx
  import React, { useRef} from 'react';
  function Example8(){
      const inputEl = useRef(null)
      const onButtonClick=()=>{ 
          console.log(inputEl) //输出获取到的DOM节点
      }
      return (
          <>
              {/*保存input的ref到inputEl */}
              <input ref={inputEl} type="text"/>
              <button onClick = {onButtonClick}>在input上展示文字</button>
          </>
      )
  }
  ```

- **保存普通变量**

  ```jsx
  function Timer() {
    const intervalRef = useRef();
  
    useEffect(() => {
      const id = setInterval(() => {
        // ...
      });
      intervalRef.current = id;
      return () => {
        clearInterval(intervalRef.current);
      };
    });
  
    // ...
  }
  ```

#### useImperativeHandle 和 forwadRef

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。`useImperativeHandle` 应当与 `forwardRef`一起使用：

```jsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中，渲染 `<FancyInput ref={inputRef}/>` 的父组件可以调用 `inputRef.current.focus()`。

#### useLayoutEffect

其函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。

#### 自定义Hook

- 自定义Hook函数和普通JS函数几乎相同，区别在于多了些 React hooks 的的特性。
- 自定义Hook函数偏向于**功能**，而组件偏向于界面和业务逻辑。

**示例**

```jsx
import React, { useState, useEffect, useCallback } from 'react';
function useWinSize(){
    let [size, setSize] = useState(
    	height: document.documentElement.clientHeight,
        widht: document.documentElement.clientWidth
    )
    
    const onResize = useCallback(()=>{
        setSize({
            height:document.documentElement.clientHeight,
        	widht: document.documentElement.clientWidth
        })
    }, [])
    useEffect(()=>{
        window.addEventListener('resize',onResize)
        return ()=>{
            window.removeEventListener('resize',onResize)
        }
    }, [])
    return size
}

//使用
function App(){
    const size = useWinSize()
    return (
    	<div>页面size：{size.width}*{size*height}</div>
    )
} 
```

