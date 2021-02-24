### 不支持在render()之外定义JSX

解决方案：在render方法中定义组件

### 不能在包含JSX元素的map循环中使用if表达式

解决方案：使用条件表达式或者逻辑表达式

### 不能使用Array.map之外的方法操作JSX数组

解决方法：先处理好需要遍历的数组，然后再用处理好的数组调用 map 方法。

### 不能在 JSX 参数中使用匿名函数

```
<View onClick={() => this.handleClick()} />

<View onClick={(e) => this.handleClick(e)} />

<View onClick={() => ({})} />

<View onClick={function () {}} />

<View onClick={function (e) {this.handleClick(e)}} />
```



### 不能在 JSX 参数中使用对象展开符

```
<View {...this.props} />

<View {...props} />

<Custom {...props} />
```

### 不支持无状态组件

无状态组件（没有自己的状态、方法、生命周期等）

* 解决方案：使用class定义组件

### 无法使用React.lazyAPI

- 由于小程序不支持动态引入，因此小程序中无法使用 `React.lazy` API。



### 事件

在 Taro 中事件遵从小驼峰式（camelCase）命名规范，所有内置事件名以 `on` 开头。

在事件回调函数中，第一个参数是事件本身，回调中调用 `stopPropagation` 可以阻止冒泡。

```
function Comp () {
  function clickHandler (e) {
    e.stopPropagation() // 阻止冒泡
  }

  function scrollHandler () {}
  
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />
}
```

