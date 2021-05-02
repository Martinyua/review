**三个问题**

- JSX 的本质是什么，它和 JS 之间到底是什么关系？

- 为什么要用 JSX？不用会有什么后果？

- JSX 背后的功能模块是什么，这个功能模块都做了哪些事情？

## JSX的本质：JavaScript 的语法扩展

> React 官方定义：JSX 是 JavaScript 的一种语法扩展，它和模板语言很接近，但是它充分具备 JavaScript 的能力。

**JSX 语法如何在 JavaScript 中生效的？**

* **JSX 被 Babel 编译后，会变成一个针对 React.createElement() 的调用，React.createElement() 将返回一个叫做 React Element 的 JS对象。**【这也是为什么在React中使用JSX语法，需要引入React】

* > 官网定义：Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

* Babel 具备将 JSX 语法转换为 JavaScript 代码的能力。**Babel 的工作原理**就是先将 ES6 源码转换为 AST，然后再将 ES6 语法的 AST 转换为 ES5 语法的 AST，最后利用 ES5 的 AST 生成 JavaScript 源代码。【就是这个插件 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)】

* **JSX 的本质是React.createElement这个 JavaScript 调用的语法糖。**

**React 选择 JSX 的动机**

* JSX 语法糖允许前端开发者使用我们最为熟悉的类 HTML 标签语法来创建虚拟 DOM，在降低学习成本的同时，也提升了研发效率与研发体验。
* 如果使用 React.createElement，代码多了，就会感觉代码很杂乱。

## JSX 如何映射为 DOM 的：createElement 源码

createElement 中并没有十分复杂的涉及算法或真实 DOM 的逻辑，它的**每一个步骤几乎都是在格式化数据**。

```javascript
//React的创建元素方法
export function createElement(type, config, children) {
  let propName; // propName 变量用于储存后面需要用到的元素属性
  const props = {}; // props 变量用于储存元素属性的键值对集合
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null; 
  let self = null; 
  let source = null; 

  if (config != null) { // config 对象中存储的是元素的属性
    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = '' + config.key; 
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
      
    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&  /
        !RESERVED_PROPS.hasOwnProperty(propName) 
      ) {
        props[propName] = config[propName]; 
      }
    }
  }
  // childrenLength 指的是当前元素的子元素的个数
  const childrenLength = arguments.length - 2; 
  if (childrenLength === 1) { 
    // 直接把这个参数的值赋给props.children
    props.children = children; 
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) { 
    // 声明一个子元素数组
    const childArray = Array(childrenLength); 
    for (let i = 0; i < childrenLength; i++) { 
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray; 
  } 
  // 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) { 
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

**入参：创建一个元素需要知道哪些消息**

createElement 有 3 个入参，这 3 个入参囊括了 React 创建一个元素所需要知道的全部信息。

- type：用于标识节点的类型。它可以是类似“h1”“div”这样的标准 HTML 标签字符串，也可以是 React 组件类型或 React fragment 类型。
- config：以对象形式传入，组件所有的属性都会以键值对的形式存储在 config 对象中。
- children：以对象形式传入，它记录的是组件标签之间嵌套的内容，也就是所谓的“子节点”“子元素”。

**逻辑层面任务流转**

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BeuGAepNsAACqreYXrj0410.png" alt="Drawing 3.png" style="zoom:50%;" />

**出参解读：初识虚拟 DOM**

```javascript
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };
  return element;
};
```

- ReactElement 把传入的参数按照一定的规范，“组装”进了 element 对象里，并把它返回给了 React.createElement，最终 React.createElement 又把它交回到了开发者手中。
- ReactElement 对象实例，本质上是**以 JavaScript 对象形式存在的对 DOM 的描述**，也就是老生常谈的“**虚拟 DOM**”。（准确说是虚拟DOM中的一个节点）

**ReactDOM.render**

该方法将虚拟DOM转换成渲染到页面的真实DOM。

```javascript
ReactDOM.render(
    // 需要渲染的元素（ReactElement）
    element, 
    // 元素挂载的目标容器（一个真实DOM）
    container,
    // 回调函数，可选参数，可以用来处理渲染结束后的逻辑
    [callback]
)
```

## JSX 与 Fiber 节点

`JSX`是一种描述当前组件内容的数据结构，他不包含组件**schedule**、**reconcile**、**render**所需的相关信息。

比如如下信息就不包括在`JSX`中：

- 组件在更新中的`优先级`
- 组件的`state`
- 组件被打上的用于**Renderer**的`标记`

这些内容都包含在`Fiber节点`中。

所以，在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。

在`update`时，`Reconciler`将`JSX`与`Fiber节点`保存的数据对比，生成组件对应的`Fiber节点`，并根据对比结果为`Fiber节点`打上`标记`。

