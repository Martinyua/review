> Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。

**何时使用 refs**

- 管理焦点，文本选择或媒体播放。
- 触发强制动画。
- 集成第三方 DOM 库。

**创建 Refs**

> Refs 是使用 `React.createRef()` 创建的，并通过 `ref` 属性附加到 React 元素。在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();  
  }
  render() {
    return <div ref={this.myRef} />;  
  }
}
```

**访问 Refs**

当 ref 被传递给 `render` 中的元素时，对该节点的引用可以在 ref 的 `current` 属性中被访问。

```js
const node = this.myRef.current;
```

ref 的值根据节点的类型而有所不同：

- 当 `ref` 属性用于 HTML 元素时，构造函数中使用 `React.createRef()` 创建的 `ref` 接收底层 DOM 元素作为其 `current` 属性。

- 当 `ref` 属性用于自定义 class 组件时，`ref` 对象接收组件的挂载实例作为其 `current` 属性。

  ```jsx
  class AutoFocusTextInput extends React.Component {
    constructor(props) {
      super(props);
      this.textInput = React.createRef();
    }
  
    componentDidMount() {
      this.textInput.current.focusTextInput();
    }
  
    render() {
      return (
        <CustomTextInput ref={this.textInput} /> //这仅在 CustomTextInput 声明为 class 时才有效
      );
    }
  }
  ```

- **你不能在函数组件上使用 `ref` 属性**，因为他们没有实例。如果要在函数组件中使用 `ref`，你可以使用 `forwardRef`（可与 `useImperativeHandle`结合使用），或者可以将该组件转化为 class 组件。

可以**在函数组件内部使用 ref 属性**，只要它指向一个 DOM 元素或 class 组件：

```jsx
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 才可以引用它  
  const textInput = useRef(null);
  function handleClick() {
    textInput.current.focus();  
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} 
	  />      
	  <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

**回调 Refs**

不同于传递 `createRef()` 创建的 `ref` 属性，你会传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问。

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.focusTextInput = () => {
      // 使用原生 DOM API 使 text 输入框获得焦点
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // 组件挂载后，让文本框自动获得焦点
    this.focusTextInput();
  }

  render() {
    // 使用 `ref` 的回调函数将 text 输入框 DOM 节点的引用存储到 React
    // 实例上（比如 this.textInput）
    return (
      <div>
        <input
          type="text"
          ref={el => {this.textInput = element;};}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

你可以在组件间传递回调形式的 refs，就像你可以传递通过 `React.createRef()` 创建的对象 refs 一样。

```jsx
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />    
	</div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}      
      />
    );
  }
}
```

**Refs 转发**

> Ref 转发是一项将  ref 自动地通过组件传递到其一子组件的技巧。

在某些情况下，你可能希望**在父组件中引用子节点的 DOM 节点**。虽然你可以 **向子组件添加 ref** ，但这不是一个理想的解决方案，因为你只能获取组件实例而不是 DOM 节点。并且，它还在函数组件上无效。所以推荐使用 refs 转发，**Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref**。

在下面的示例中，`FancyButton` 使用 `React.forwardRef` 来获取传递给它的 `ref`，然后转发到它渲染的 DOM `button`：

```jsx
const FancyButton = React.forwardRef((props, ref) => (  
    <button ref={ref} className="FancyButton">    
        {props.children}
    </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

这样，使用 `FancyButton` 的组件可以获取底层 DOM 节点 `button` 的 ref ，并在必要时访问，就像其直接使用 DOM `button` 一样。

以下是对上述示例发生情况的逐步解释：

1. 我们通过调用 `React.createRef` 创建了一个 React ref 并将其赋值给 `ref` 变量。
2. 我们通过指定 `ref` 为 JSX 属性，将其向下传递给 `<FancyButton ref={ref}>`。
3. React 传递 `ref` 给 `forwardRef` 内函数 `(props, ref) => ...`，作为其第二个参数。
4. 我们向下转发该 `ref` 参数到 `<button ref={ref}>`，将其指定为 JSX 属性。
5. 当 ref 挂载完成，`ref.current` 将指向 `<button>` DOM 节点。

