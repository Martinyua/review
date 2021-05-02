shouldComponentUpdate、PureComponent、React.memo 都是React中的一些性能优化手段。

## shouldComponentUpdate

React提供了生命周期函数`shouldComponentUpdate()`，根据它的返回值（true | false），判断 React 组件的输出是否受当前 state 或 props 更改的影响。**默认行为是 state 每次发生变化组件都会重新渲染**。

引用一段来自[官网](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)的描述：

> 当 props 或 state 发生变化时，`shouldComponentUpdate()` 会在渲染执行之前被调用。返回值默认为 true。目前，如果`shouldComponentUpdate`返回 false，则不会调用`UNSAFE_componentWillUpdate()`，`render()`和`componentDidUpdate()`方法。后续版本，React 可能会将`shouldComponentUpdate()`视为提示而不是严格的指令，并且，当返回 false 时，仍可能导致组件重新渲染。

`shouldComponentUpdate`方法接收两个参数`nextProps`和`nextState`，可以将`this.props`与`nextProps`以及`this.state`与`nextState`进行比较，并返回 false 以告知 React 可以跳过更新。

**使用 `shouldComponentUpdate` 进行深层比对**

```js
import { is } from 'immutable';

shouldComponentUpdate: (nextProps = {}, nextState = {}) => {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }

  for (const key in nextProps) {
    if (thisProps[key] !== nextProps[key] || ！is(thisProps[key], nextProps[key])) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key] || ！is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
}
```

## PureComponent

`React.PureComponent`与`React.Component`很相似，都是定义一个组件类。两者的区别在于`React.Component`并未实现 `shouldComponentUpdate`，而`React.PureComponent`中以浅层对比 prop 和 state 的方式来实现了该函数。

当 `React.Component` 的 props 和 state 均为**基本类型**，使用 `React.PureComponent` 会节省应用的性能。

当props 或 state 为 **复杂的数据结构** （例如：嵌套对象和数组）时，因为 `React.PureComponent` 仅仅是 **浅比较** ，可能会渲染出 **错误的结果** 。这时有 **两种解决方案** ：

- 当 **知道** 有深度数据结构更新时，可以直接调用 **forceUpdate**  强制更新
- 考虑使用  [immutable objects](https://facebook.github.io/immutable-js/) （不可突变的对象），实现快速的比较对象

**核心源码**

```js
function shallowEqual (objA: mixed, objB: mixed): boolean {
  // 下面的 is 相当于 === 的功能，只是对 + 0 和 - 0，以及 NaN 和 NaN 的情况进行了特殊处理
  // 第一关：基础数据类型直接比较出结果
  if (is (objA, objB)) {
    return true;
  }
  // 第二关：只要有一个不是对象数据类型就返回 false
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  // 第三关：在这里已经可以保证两个都是对象数据类型，比较两者的属性数量
  const keysA = Object.keys (objA);
  const keysB = Object.keys (objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // 第四关：比较两者的属性是否相等，值是否相等
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA [i]) ||
      !is (objA [keysA [i]], objB [keysA [i]])
    ) {
      return false;
    }
  }

  return true;
}
```

由于 JS 引用赋值的原因，这种方式仅仅适用于无状态组件或者状态数据非常简单的组件，对于大量的应用型组件，它是无能为力的。

**注意**

- 突变一般是不好的，但在使用 `PureComponent` 时，问题会更加复杂。
- 不要在渲染方法中创建新函数、对象或数组，这会导致项目性能显著降低。

## React.memo

> `React.memo` 为高阶组件。它与 `React.PureComponent` 非常相似，但**只适用于函数组件**，而不适用 class 组件。
>
>  如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
>
>  `React.memo` **仅检查 props 变更**。如果函数组件被 `React.memo` 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。
>
>  默认情况下其只会对复杂对象做**浅层对比**，如果你想要控制对比过程，那么请将**自定义的比较函数**通过第二个参数传入来实现。

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}

// 比较函数
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  返回 true，复用最近一次渲染
  返回 false，重新渲染
  */
}

export default React.memo(MyComponent, areEqual);
```

- `React.memo` 通过记忆组件渲染结果的方式实现 ，提高组件的性能
- 只会对 `props` 浅比较，如果相同，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
- 可以将自定义的比较函数作为第二个参数，实现自定义比较
- 此方法仅作为**性能优化**的方式而存在。但请不要依赖它来“阻止”渲染，这会产生 bug。
- 与 class 组件中 `shouldComponentUpdate()` 方法不同的是，如果 props 相等，`areEqual`会返回 `true`；如果 props 不相等，则返回 `false`。这与 `shouldComponentUpdate` 方法的返回值相反。

## useMemo

> React.memo 控制是否需要重渲染一个组件，而 useMemo 控制的则是是否需要重复执行某一段逻辑。

使用示例：

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

我们可以把目标逻辑作为第一个参数传入，把逻辑的依赖项数组作为第二个参数传入。这样只有当依赖项数组中的某个依赖发生变化时，useMemo 才会重新执行第一个入参中的目标逻辑。

## 参考

- [React 源码漂流（三）之 PureComponent](https://juejin.im/post/6844903907664068622)

- [React性能优化之shouldComponentUpdate、PureComponent和React.memo](https://juejin.im/post/6844904131505700871)