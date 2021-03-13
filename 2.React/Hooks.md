### useState

```
const [count,setCount] = useState(0) //useState返回一个数组，数组中有state和一个修改state的方法。通过解构赋值取得

//setCount的两种使用方式
setCount(1)
setCount(c => c + 1)
```

### useReducer

  * 通过dispatch一个action告诉reducer如何更新state
  * userReducer接受一个方法和默认state，返回一个dispatch函数
  * dispatch函数接受state和action，通过action.type来判断如何更新state

  ```
  funCtion countReducer(state,action){
      switch(action.type){
          case 'add':
          return state + 1
          case 'minus':
          return state - 1
          default: 
          return state
      }
  }
  const [count ,dispatchCount] = userReducer(countReducer,0)
  dispatchCount({type:'add'})
  ```

### useEffect(() =>{},[])

> 函数组件无法直接使用生命周期函数，必须托管Hook来进行管理
>
> useEffect可以使用的3个生命周期函数
>
> * componentDidmount
> * componentDidUpdate
> * componentWillUnmount

  * 传入两个参数，第一个是一个回调函数，相当于didmount后执行，如果这个函数return了一个函数，**那么return的这个函数将会在willUnmount的时候执行**。
  * 第二个参数是一个数组，数组中需传入state，指定当改state发生变化时才会执行effect。如果某些特定值在两次重渲染之间**没有发生变化**，你可以通知 React **跳过**对 effect 的调用

### memo 

React.momo其实并不是一个hook，它其实等价于PureComponent，但是它只会对比props。

### useMemo

会回缓存更新的数据。	

它的第二个参数和useEffect的第二个参数是一样的，只有在第**二个参数数组的值发生变化时，才会触发子组件的更新。**

### useCallback

useCallback 的用法和 useMemo 类似，是专门用来**缓存函数**的 hooks，也是接收两个参数，同时，**我们第一个参数传入额回调函数就是要缓存的函数。**

["Hooks"]: https://juejin.cn/post/6850037283535880205#heading-20



