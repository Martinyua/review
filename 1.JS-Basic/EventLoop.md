## 什么是事件循环

首先JavaScript是单线程，单线程以为着就要排队。前一个任务执行结束，后一个任务才会执行。如果前一个任务执行时间很久，那么后一个任务必须一直等待。为此，JavaScript设计者在广义上将任务分为同步任务和异步任务。首先所有同步任务都在主线程上执行，形成一个**执行栈。**主线程外，还存在一个**任务队列**，只要异步任务有了运行结果，就在任务队列中放置一个事件；一旦执行栈中所有任务执行完毕，系统就会去任务队列中取出对应的回调函数进行执行。主线程不断重复以上操作。

即：主线程不断从消息队列中获取消息，执行消息，这个过程成为事件循环

除了广义上的同步任务和异步任务，我们还可以将任务细分为宏任务和微任务。



### 同步任务 异步任务

单线程即意味着所有任务都需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就必须一直等着。为此，JavaScript 设计者在广义上将所有任务分成两种：**同步任务（synchronous）**、**异步任务（asynchronous）**，运行机制如下：

1. 所有同步任务都在主线程上执行，形成一个 *执行栈*；
2. 主线程外，还存在一个 *任务队列*，只要异步任务有了运行结果，就在任务队列中放置一个事件；
3. 一旦执行栈中所有同步任务执行完毕，系统就会取出任务队列中事件对应的回调函数进入执行栈，开始执行；
4. 主线程不断重复上面的第三部。

### 宏任务、微任务

除了广义上的定义，我们将任务进行更精细的定义，

​	任务队列的任务又分为宏任务和微任务，宏任务一次只取一个任务执行，执行完后去取微任务队列的任务执行至空。

* `macrotask`：
  * script（整体代码）
  * 事件回调（DOM）
  * XHR回调
  * `setTimeout`
  * `setInterval`
  * `setImmediate`
  * I / O
  * UI render
* **micro-task（微任务）** 大概包括：
  - process.nextTick
  - Promise.then
  - async / await （等价于 Promise.then）
  - MutationObserver（HTML5 新特性，监控某个节点）

## 答题大纲

1. 先说基本知识点：宏任务哪些，微任务哪些
2. 说说事件循环机制过程，边说边画
3. 说说 async / await 执行顺序注意，可以把 chrome 的优化，做法其实是违反了规范的，V8 团队的 PR 这些自信点说出来，会显得很好学，理解的很详细，很透彻
4. 把 node 的事件循环也说一下，重复 1、2、3点，并且着重说 node v11 前后事件循环的变动

## 浏览器中的事件循环

JavaScript代码的执行过程中，除了依靠函数调用栈来搞定函数的执行顺序以外，还依靠任务队列（task queue）来搞定另外一些代码的执行。整个执行过程，我们称为事件循环过程。一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。任务队列又分为 macro-task（宏任务）和 micro-task（微任务），在最新标准中，他们分别被称为 tasks 和 jobs。

**macro-task（宏任务）** 大概包括：

- script（整体代码）
- setTimeout
- setInterval
- setImmediate
- I / O
- UI render

**micro-task（微任务）** 大概包括：

- process.nextTick
- Promise.then
- async / await （等价于 Promise.then）
- MutationObserver（HTML5 新特性）

总体结论就是：

- 执行宏任务
- 然后执行宏任务产生的微任务
- 若微任务在执行过程中产生了新的微任务，则继续执行微任务
- 微任务执行完毕，再回到宏任务中进行下一轮循环
- **浏览器只保证`requestAnimationFrame`的回调在重绘之前执行，没有确定的时间，何时重绘由浏览器决定**
- process.nextTick的优先级高于Promise.then。可以理解为在宏任务结束，微任务开始之前执行。
- ![1616205465544](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1616205465544.png)

## async / await 执行顺序

我们知道 `async` 会隐式返回一个 Promise 作为结果的函数，那么可以简单理解为：await 后面的函数在执行完毕后，await 会产生一个微任务（Promise.then 是微任务）。但是我们要注意微任务产生的时机，它是执行完 await 后，直接跳出 async 函数，执行其他代码（此处就是协程的运作，A暂停执行，控制权交给B）。其他代码执行完毕后，再回到 async 函数去执行剩下的代码，然后把 await 后面的代码注册到微任务队列中。例如：

```js
console.log('script start')

async function async1() {
	await async2()
	console.log('async1 end')
}

async function async2() {
	console.log('async2 end')
}
async1()

setTimeout(function() {
	console.log('setTimeout')
}, 0)

new Promise(resolve => {
	console.log('Promise')
	resolve()
}).then(function() {
	console.log('promise1')
}).then(function() {
	console.log('promise2')
})

console.log('script end')

// 旧版输出如下，但是请继续看完本文下面的注意那里，新版有改动
// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout
```

分析这段代码：

1. 执行代码，输出 `script start`
2. 执行 `async1()`，调用了 `async2()`，然后输出 `async2 end`，此时会保留 async1 的上下文，然后跳出 async1
3. 遇到 `setTimeout`，产生一个宏任务
4. 执行 Promise，输出 Promise，遇到 then，产生第一个微任务，继续执行代码，输出 `script end`
5. 当前宏任务执行完毕，开始执行当前宏任务产生的微任务，输出 `promise1`，然后又遇到 then，产生一个新的微任务
6. 执行微任务，输出 `promise2`，此时微任务队列已清空，执行权交还给 async1
7. 执行 await 后的代码，输出 `async1 end`
8. 所有微任务队列均已执行完毕，开始执行下一个宏任务，打印 `setTimeout`

**注意**

新版的 chrome 并不是像上面那样的执行顺序，它优化了 await 的执行速度，await 变得更早执行了，输出变更为：

```
// script start => async2 end => Promise => script end => async1 end => promise1 => promise2 => setTimeout
```

但是这种做法其实违反了规范，但是规范也可以更改的，这是 V8 团队的一个 [PR](https://github.com/tc39/ecma262/pull/1250#issue-197979338) ，目前新版打印已经修改。知乎上也有相关的 [讨论](https://www.zhihu.com/question/268007969) 。

我们可以分两种情况进行讨论

1. 如果 await 后面直接跟的为一个变量，比如 `await 1 `。这种情况相当于直接把 await 后面的代码注册为一个微任务，可以简单理解为 `Promise.then(await 后面的代码)`，然后跳出函数去执行其他的代码。

2. 如果 await 后面跟的是一个异步函数的调用，比如上面的代码修改为：

   ```
   console.log('script start')
   
   async function async1() {
       await async2()
       console.log('async1 end')
   }
   async function async2() {
       console.log('async2 end')
       return Promise.resolve().then(()=>{
           console.log('async2 end1')
       })
   }
   async1()
   
   setTimeout(function() {
       console.log('setTimeout')
   }, 0)
   
   new Promise(resolve => {
       console.log('Promise')
       resolve()
   }).then(function() {
       console.log('promise1')
   }).then(function() {
       console.log('promise2')
   })
   
   console.log('script end')
   ```

   输出为：

   ```
   // script start => async2 end => Promise => script end => async2 end1 => promise1 => promise2 => async1 end => setTimeout
   ```

   此时 执行完 await 并不会把 await 后面的代码注册到微任务对立中，而是执行完 await 之后，直接跳出了函数，执行其他同步代码，直到其他代码执行完毕后，再回到这里将 await 后面的代码推倒微任务队列中执行。注意，此时微任务队列中是有之前注册的其他微任务，所以这种情况会先执行其他的微任务。可以理解为 await 后面的代码会在本轮循环的最后被执行。

#### 一个小例子

```
//打印1-10
for (var i = 1; i <= 10; i++) {
	setTimeout(function () {
		console.log(i);
	}, 1000);
}
//结果打印了10个11
复制代码
```

1.for 循环是一个同步任务，在主线程上执行，形成一个执行栈，i从1-10，依次遍历

2.i从1-10，依次遍历过程中，都会遇到`setTimeout`，则浏览器渲染进程新开一个定时器触发线程，这时，for循环所在的线程和定时器所在的线程并发执行

3.`setTimeout`里面的回调函数是一个异步操作，事件循环线程会把它加入到任务源为`setTimeout`的任务队列中，并没有执行

4.for循环中当i=11时，退出for循环，该同步任务结束，此时，主线程的执行栈中没有其他的同步任务了，于是开始依次从任务源为`setTimeout`的任务队列中读取任务（回调函数）并加入到主线程执行栈中执行，因此，打印了10个11

## 优先级

同步代码（宏任务） > **`process.nextTick > Promise（微任务）`**> setTimeout(fn)、setInterval(fn)（宏任务）> setImmediate（宏任务）> setTimeout(fn, time)、setInterval(fn, time)，其中time>0



## node 中的事件循环

同样是使用 V8 引擎的 Node.js 也同样有事件循环。事件循环是 Node 处理非阻塞 I / O 操作的机制，Node 中实现事件循环依赖的是 `libuv` 引擎。由于 Node 11 之后，事件循环的一些原理发生了改变，这里就以新的标准去讲，最后再列上变化点让大家了解前因后果。

### 宏任务和微任务

node 中也分为宏任务和微任务，其中，

macro-task（宏任务）包括：

- setTimeout
- setInterval
- setImmediate
- script（整体代码）
- I / O 操作

micro-task（微任务）包括：

- process.nextTick（与普通微任务有区别，在微任务队列执行之前执行）
- Promise.then 回调

### node 事件循环整体理解

[![img](https://camo.githubusercontent.com/a2b8d10da443213bbaf9ecbbc9f0a7632c9f1ce0e73503bf52cdd6d9b917804b/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323032302f332f322f313730393935316536353861663139373f696d616765736c696d)](https://camo.githubusercontent.com/a2b8d10da443213bbaf9ecbbc9f0a7632c9f1ce0e73503bf52cdd6d9b917804b/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323032302f332f322f313730393935316536353861663139373f696d616765736c696d)

图中每个框被成为事件循环机制的一个阶段，每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但是通常情况下，当事件循环进入特定的阶段时，它将执行特性该阶段的任何操作，然后执行该阶段队列中的回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段。

因此，上图可以简化为以下流程：

1. 输入数据阶段（incoming data）
2. 轮询阶段（poll）
3. 检查阶段（check）
4. 关闭时间回调阶段（close callback）
5. 定时器检测阶段（timers）
6. I / O 事件回调阶段（I / O callbacks）
7. 闲置阶段（idle，prepare）
8. 轮询阶段...

### 阶段概述

timer ->  I/O callback（IO回调）-> idle,prepare -> poll -> cheak -> colse callback









- 定时器检测阶段（timers）：本阶段执行 timers 的回调，即 setTimeout、setInterval 里面的回调函数
- I / O 事件回调阶段（I / O callbacks）：执行延迟到下一个循环迭代的 I / O 回调，即上一轮循环中未被执行的一些 I / O 回调
- 闲置阶段（idle，prepare）：仅供内部使用
- 轮询阶段（poll）：检索新的 I / O 事件；执行与 I / O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些计时器和 setImmediate 调度之外），其余情况 node 将在适当的时候在此阻塞
- 检查阶段（check）：setImmediate 回调函数将在此阶段执行
- 关闭事件回调阶段（close callback）：一些关闭的回调函数，如 `socket.on('close', ...)`

### 三大重点阶段

日常开发中绝大部分异步任务都在 poll、check、timers 这三个阶段处理，所以需要重点了解这三个阶段

#### timers

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。同样，在 Node 中定时器指定的时间也不是准确时间，只是尽快执行。

#### poll

poll 是一个至关重要的阶段，poll 阶段的执行逻辑流程图如下：

[![img](https://camo.githubusercontent.com/439714258d0ec42285001c552d7000e9d166521b72fdc92dacef484ec034891f/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323032302f332f322f313730393935316536356666653030653f696d616765736c696d)](https://camo.githubusercontent.com/439714258d0ec42285001c552d7000e9d166521b72fdc92dacef484ec034891f/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323032302f332f322f313730393935316536356666653030653f696d616765736c696d)

如果当前已经存在定时器，而且有定期到时间了，拿出来执行，事件循环将会到 timers 阶段

如果没有定时器，回去看回调函数队列

- 如果 poll 队列不为空，会遍历回到队列并同步执行，直到队列为空或达到系统限制
- 如果 poll 队列为空，会有两件事发生
  - 如果 setImmediate 回调需要执行，poll 阶段将会停止并进入 check 阶段执行回调
  - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置，防止一直等待下去，一段时间后自动进入 check 阶段

#### check

check 阶段，这是一个比较简单的阶段，直接执行 setImmediate 的回调

#### process.nextTick

`process.nextTick` 是独立于事件循环的任务队列

在每一个事件循环阶段完成后会去检查 nextTick 队列，如果里面有任务，会让这部分任务优先于微任务执行。

看一个例子：

```
setImmediate(() => {
    console.log('timeout1')
    Promise.resolve().then(() => console.log('promise resolve'))
    process.nextTick(() => console.log('next tick1'))
});
setImmediate(() => {
    console.log('timeout2')
    process.nextTick(() => console.log('next tick2'))
});
setImmediate(() => console.log('timeout3'));
setImmediate(() => console.log('timeout4'));
```

- 在 node11 之前，因为每一个事件循环阶段完成后都会去检查 nextTick 队列，如果里面有任务，会让这部分任务优先于微任务执行，因此上述代码是先进入 check 阶段，执行所有 setImmediate，完成之后执行 nextTick 队列，最后执行微任务队列，因此输出为：

  ```
  // timeout1 -> timeout2 -> timeout3 -> timeout4 -> next tick1 -> next tick2 -> promise resolve
  ```

- 在 node11 之后，`process.nextTick` 被视为是微任务的一种，因此上述代码是先进入 check 阶段，执行一个 `setImmediate` 宏任务，然后执行其微任务队列，在执行下一个宏任务及其微任务队列，因此输出为：

  ```
  // timeout1 -> next tick1 -> promise resolve -> timeout2 -> next tick2 -> timeout3 -> timepout4
  ```

## node 版本差异说明

这里主要说明 node11 前后的差异，因为 node11 之后一些特性向浏览器看齐，总的变化一句话来说就是：

**如果是 node11 版本一旦执行一个阶段里的一个宏任务（setTimeout、setInterval、setImmediate）就会立刻执行对应的微任务队列**

### timers 阶段执行时机的变化

```
setTimeout(() => {
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(() => {
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

- 如果是 node11以后的版本一旦执行到一个阶段内的一个宏任务（setTimeout、setInterval 和 setImmediate）就会立刻执行微任务队列，这和浏览器的运行方式是一致的，最后输出为：

  ```
  // timer1 -> promise1 -> timer2 -> promise2
  ```

- 如果是 node11 之前的版本，要看第一个定时器执行完，第二个定时器是否在完成队列中

  - 如果第二个定时器还未在完成队列中，最后的结果为

    ```
    // timer1 -> promise1 -> timer2 -> promise2
    ```

  - 如果第二个定时器已经在完成队列中，最后结果为

    ```
    // timer1 -> timer2 -> promise1 -> promise2
    ```

### check 阶段的执行时机变化

```
setImmediate(() => console.log('immediate1'));
setImmediate(() => {
    console.log('immediate2')
    Promise.resolve().then(() => console.log('promise resolve'))
});
setImmediate(() => console.log('immediate3'));
setImmediate(() => console.log('immediate4'));
```

- 如果是 node11 后的版本，会输出

  ```
  // immediate1 -> immediate2 -> promise resolve -> immediate3 -> immediate4
  ```

- 如果是 node11 前的版本，会输出

  ```
  // immediate1 -> immediate2 -> immediate3 -> immediate4 -> promise resolve
  ```

### nextTick 队列执行时机的变化

```
setImmediate(() => console.log('timeout1'));
setImmediate(() => {
    console.log('timeout2')
    process.nextTick(() => console.log('next tick'))
});
setImmediate(() => console.log('timeout3'));
setImmediate(() => console.log('timeout4'));
```

- 如果是 node11 后的版本，会输出

  ```
  // timeout1 -> timeout2 -> next tick -> timeout3 -> timeout4
  ```

- 如果是 node11 前的版本，会输出

  ```
  // timeout1 -> timeout2 -> timeout3 -> timeout4 -> next tick
  ```

## node 和 浏览器事件循环的主要区别

浏览器环境下，`microtask` 的任务队列是每个 `macrotask` 执行完之后执行。而在 Node.js 中，microtask 会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行 `microtask` 队列的任务。