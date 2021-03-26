### async/await

#### 使用

在我们处理异步的时候，比起回调函数，Promise的then方法会显得较为简洁和清晰，但是在处理多个**彼此之间相互依赖的请求的时候**，就会显的有些累赘。这时候，用async和await更加优雅

- 规则一：凡是在前面添加了async的函数在执行后都会返回一个Promise对象

```js
async function test() {
    
}

let result = test()
console.log(result)  //即便代码里test函数什么都没返回，我们依然打出了Promise对象
```

- 规则二：await必须在async函数里使用，不能单独使用
- 规则三：await后面需要跟**Promise对象**，不然就没有意义，而且await后面的Promise对象不必写then，因为await的作用之一**就是获取后面Promise对象成功状态传递出来的参数。**



#### 比Promise链式调用更加优雅：

在前端编程中，我们偶尔会遇到这样一个场景：我们需要发送多个请求，而**后面请求的发送总是需要依赖上一个请求返回的数据**。对于这个问题，我们既可以用的Promise的链式调用来解决，也可以用async/await来解决，然你而后者会更简洁些。

```js
function request(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(time)
        }, time)
    })
}

request(500).then(result => {
    return request(result + 1000)
}).then(result => {
    return request(result + 1000)
}).then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
}) 

```

用async/await来处理

```js
function request(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(time)
        }, time)
    })
}

async function getResult() {
    let p1 = await request(500)
    let p2 = await request(p1 + 1000)
    let p3 = await request(p2 + 1000)
    return p3
}

getResult().then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})

```

相对于使用then不停地进行链式调用， 使用async/await会显的更加易读一些。

#### 同步与异步

在async函数中使用await，**那么await这里的代码就会变成同步的了**，意思就是说只有等await后面的Promise执行完成得到结果才会继续下去，await就是等待，这样虽然避免了异步，但是它也会阻塞代码，所以使用的时候要考虑周全。

#### 特点

**内置执行器。** Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

**更好的语义。** async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

**更广的适用性。** co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

**缺点：**

因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 `await` 会导致性能上的降低。



#### 原理

**await 原理是什么？**

`async` 函数的实现，就是将 `Generator`函数和自动执行器，包装在一个函数里。

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    var gen = genF();
    function step(nextF) {
      try {
        var next = nextF();
      } catch(e) {
        return reject(e); 
      }
      if(next.done) {
        return resolve(next.value);
      } 
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });      
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

