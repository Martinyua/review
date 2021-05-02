W3C 性能工作组规定：将执行时间超过 50ms 任务定义为长任务 [Long Task (opens new window)](https://developer.mozilla.org/zh-CN/docs/Web/API/Long_Tasks_API)。

时间切片的核心思想是：如果任务不能在 50 毫秒内执行完，那么为了不阻塞主线程，这个任务应该让出主线程的控制权，使浏览器可以处理其他任务。让出控制权意味着停止执行当前任务，让浏览器去执行其他任务，随后再回来继续执行没有执行完的任务。 所以时间切片的目的是不阻塞主线程，而实现目的的技术手段是将一个长任务拆分成很多个不超过 50ms 的小任务分散在宏任务队列中执行。

所以时间切片的目的是不阻塞主线程，而实现目的的技术手段是将一个长任务拆分成很多个不超过 50ms 的小任务分散在宏任务队列中执行。

WARNING

使用时间切片的缺点是，任务运行的总时间变长了，这是因为它每处理完一个小任务后，主线程会空闲出来，并且在下一个小任务开始处理之前有一小段延迟。

但是为了避免卡死浏览器，这种取舍是很有必要的。

## React 时间切片原理

React 时间切片的本质是模拟实现 `requestIdleCallback`

下图是浏览器一帧中可以用于执行 JS 的时机

```js
一个task(宏任务) -- 队列中全部job(微任务) -- requestAnimationFrame -- 浏览器重排/重绘 -- requestIdleCallback
```

`requestIdleCallback` 是在“浏览器重排/重绘”后如果当前帧还有空余时间时被调用的。

浏览器并没有提供其他 API 能够在同样的时机（浏览器重排/重绘后）调用以模拟其实现。

最常见的 task 当属 `setTimeout` 了。但是有个 task 比 `setTimeout` 执行时机更靠前，那就是 `MessageChannel`。所以 Scheduler 将需要被执行的回调函数作为 `MessageChannel` 的回调执行。如果当前宿主环境不支持 `MessageChannel`，则使用 `setTimeout`。

在 React 的 render 阶段，开启 Concurrent Mode 时，每次遍历前，都会通过 `Scheduler` 提供的 `shouldYield` 方法判断是否需要中断遍历，使浏览器有时间渲染：

```js
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

是否中断的依据，最重要的一点便是每个任务的剩余时间是否用完。在 `Schdeduler` 中，为任务分配的初始剩余时间为 5ms。

```js
yieldInterval = 5
deadline = currentTime + yieldInterval
function shouldYield() {
  {
    return exports.unstable_now() >= deadline
  }
}
```

在 Schdeduler 中，为任务分配的初始剩余时间为 5ms。 随着应用运行，会通过 fps 动态调整分配给任务的可执行时间。

```js
forceFrameRate = function(fps) {
  if (fps < 0 || fps > 125) {
    // Using console['error'] to evade Babel and ESLint
    console['error'](
      'forceFrameRate takes a positive int between 0 and 125, ' +
        'forcing frame rates higher than 125 fps is not unsupported'
    )
    return
  }
  if (fps > 0) {
    yieldInterval = Math.floor(1000 / fps)
  } else {
    // reset the framerate
    yieldInterval = 5
  }
}
```

## 总结

开启 Concurrent Mode 之后，React 就会开启 Time Slicing。会把 reconciler 阶段的 Long task 变成拆分为 `5 ms (60fps)` 左右的的任务，减小浏览器的卡顿





```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import './App.css'
import { useState } from 'react'

Array.prototype.shuffle = function() {
  var input = this

  for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1))
    var itemAtIndex = input[randomIndex]

    input[randomIndex] = input[i]
    input[i] = itemAtIndex
  }

  return input
}

let a = []

for (let i = 0; i <= 9000; i++) {
  a.push(i)
}

function List(props) {
  return (
    <div>
      {props.arrList.map(item => (
        <li key={item}>{item}</li>
      ))}
    </div>
  )
}

function App() {
  let [arr, updatearr] = useState(a)

  return (
    <>
      <button
        onClick={() => {
          updatearr(arr => {
            return [...arr.shuffle()]
          })
        }}>
        加载数据
      </button>

      <ul>
        <List arrList={arr}></List>
      </ul>
    </>
  )
}

// ReactDOM.render(<Clock />, document.getElementById('root'));
ReactDOM.unstable_createRoot(document.getElementById('root')).render(<App />)
```