### Promise

Promise 是现代 Web 异步开发的重要组成部分，基本上目前所有的 Web 应用的异步开发手段都是通过 Promise 来实现的。

#### 概念

所谓 Promise，就是一个容器对象，里面保存着某个未来才会结束的事件（异步事件）的结果。Promise 是一个构造函数，它有三个特点：

1. Promise 有三个状态：**pending（进行中）、fulfilled（成功）和 reject（失败）**，并且状态不受外部影响。
2. 状态一旦改变就**无法修改，**并且状态只能从 pending 到 fulfilled 或者是 pending 到 reject。
3. Promise 一旦创建就会立即执行，不能中途取消。



#### 用法

在 Promise 诞生之前，Web 应用中的异步开发主要采用的是回调函数的模式，回调函数的一大缺点就是，**当我们的一个异步结果需要使用另外一个异步结果时，就会产生回调嵌套，一旦这样的嵌套多了，就会变成回调地狱**，十分影响代码观感。

而 Promise 的诞生一定程度上解决了这个问题，因为 Promise 是采用链式调用的方式，并且在 Promise 返回的 Promise 对象中的 then、catch 等一系列方法都会返回一个新的 Promise 对象。

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject，他们是两个函数，由JavaScript提供。

- resolve的作用是将pending变为resolved，在异步操作成功时调用，并将结果传递出去
- reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

#### API

- **Promise.prototype.then方法**

  - ```
    promise.then(
      function(value) {
        // success
      },
      function(error) {
        // failure
      }
    )
    ```

  - then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数

  - then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用**链式写法**，即 then 方法后面再调用另一个 then 方法。如果return的不是Promise对象，也会被封装成一个Promise对象（一般用于后一个请求依赖于前一个请求的结果时）

    ```js
    getJSON('/posts.json')
      .then(function(json) {
        return json.post
      })
      .then(function(post) {
        // ...
      })
    ```

- **Promise.prototype.catch方法**

  - Promise.prototype.catch 方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
  - Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

- **finally方法**

  ```js
  promise
  .then(result => {···})
  .catch(error => {···})
  .finally(() => {···});
  ```

  finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。

- **Promise.resolve()**

  - 有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。

    ```js
    const jsPromise = Promise.resolve($.ajax('/whatever.json'))
    ```

- **Promise.all**

  - 接受一个可迭代对象，返回一个新的Promise

  - 在前端的开发实践中，我们有时会遇到需要发送多个请求并根据请求顺序返回数据的需求，比如，我们要发送a、b、c三个请求，这三个请求返回的数据分别为a1、a2、a3，而我们想要a1、a2、a3按照我们希望的顺序返回。

  - 当对象里的所有 Promise 都 resolve 时，返回的 Promise 也会 resolve。当有一个reject时，返回的Promise会立刻reject

    ```js
    let p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('p1')
      }, 500)
    })
    
    let p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('p2')
      }, 1000)
    })
    
    let p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('p3')
      }, 1500)
    })
    
    let P = Promise.all([p1, p2, p3]).then(res => {
      console.log(res)
      console.log(P)
    })
    ```

    

- **Promise.race**

  - Promise 接受一个可迭代对象，里面的 Promise 是竞争关系，谁先 resolve 或者 reject 立刻会被当做返回值返回到外部。其他会 settled 的 Promise 会继续执行但不会再影响结果。

    ```js
    let p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('p1')
      }, 500)
    })
    
    let p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('p2')
      }, 1000)
    })
    let p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('p3')
        resolve('p3')
      }, 1500)
    })
    
    let P = Promise.race([p1, p2, p3])
      .then(res => {
        console.log(res)
      })
      .catch(res => {
        console.log(res)
      })
    ```

    