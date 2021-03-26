### Generator/协程/yield/co模块

[参考](https://wangdoc.com/es6/generator-async.html#%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%E7%9A%84%E5%B0%81%E8%A3%85)

#### Generator

简单理解：可以中断的函数 

**Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。**

```
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

**上面代码中，调用 Generator 函数，会返回一个内部指针（即遍历器）`g`。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。调用指针`g`的`next`方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的`yield`语句，上例是执行到`x + 2`为止。**

Generator函数和普通函数完全**不同**，有其与众不同的独特语法。一个简单的Generator函数就长下面这个样子：

```js
function* greet() { yield 'hello' }
```

**在第一次调用**Generator函数的时候并**不会执行**Generator函数内部的代码，而是会返回一个**生成器对象**

通过调用这个生成器对象的`next`函数可以开始执行Generator函数内部的逻辑，在遇到`yield`语句会暂停函数的执行，同时向外界返回`yield`关键字后面的结果。暂停后需要恢复执行就需要调用生成器对象`next`方法恢复

关键词：

1. **第一次调用不会执行，只返回一个生成器对象。**
2. **然后通过这个生成器对象的next方法调用开始执行。**
3. **遇到yield则暂停并且返回关键词后结果。**
4. **遇到next继续执行**

例子：

```js
function* greet() {
  let result = yield 'hello'
  console.log(result)
}
let g = greet()
g.next() // {value: 'hello', done: false}
g.next(2) // 打印结果为2，然后返回{value: undefined, done: true}

```

- **生成器**对象还有以下两个方法：return和throw

  - return：和迭代器接口的return方法一样，**用于在生成器函数执行过程中遇到异常或者提前中止**（比如在for...of循环中未完成时提前break）时自动调用，同时生成器对象变为**终止态**，无法再继续产生值。
  - throw：throw方法。调用此方法会在生成器函数当前暂停执行的位置处抛出一个错误。

  

#### yield

- 遇到 yield 表达式，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值。
- 下次调用 next 方法时，再继续往下执行，直到遇到下一个 yield 表达式。
- 如果没有再遇到新的 yield 表达式，就一直运行到函数结束，知道 return语句为止，并将return语句后面的表达式的值，作为返回对象的 value的值。
- 如果没有return 语句，则返回的对象 value 属性值为 undefined。
- 在generator函数中调用generator：yield *

#### co模块

概念：用于**Generator函数自动执行**的工具

```
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

var co = require('co');
co(gen);

```

 `co`函数返回一个`Promise`对象，因此可以用`then`方法添加回调函数。



co模块的原理：

Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

 两种方法可以做到这一点。

 （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。

 （2）Promise 对象。将异步操作包装成 Promise 对象，用`then`方法交回执行权。

 co模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。



> 面试官：说说 Generator 是如何使用的？以及各个阶段的状态是如何变化的？

使用生成器函数可以生成一组值的序列，每个值的生成是基于每次请求的，并不同于标准函数立即生成。

调用生成器不会直接执行，而是通过叫做**迭代器**的对象控制生成器执行。

```js
function* WeaponGenerator(){
    yield "1";
    yield "2";
    yield "3";
}

for(let item of WeaponGenerator()){
    console.log(item);
}
//1
//2
//3
复制代码
```

使用迭代器控制生成器。

- 通过调用生成器返回一个迭代器对象，用来控制生成器的执行。
- 调用迭代器的 `next` 方法向生成器请求一个值。
- 请求的结果返回一个对象，对象中包含一个`value`值和 `done`布尔值，告诉我们生成器是否还会生成值。
- 如果没有可执行的代码，生成器就会返回一个 `undefined` 值，表示整个生成器已经完成。

```
function* WeaponGenerator(){
    yield "1";
    yield "2";
    yield "3";
}

let weapon = WeaponGenerator();
console.log(weapon.next());
console.log(weapon.next());
console.log(weapon.next());
复制代码
```

状态变化如下：

- 每当代码执行到 `yield` 属性，就会生成一个中间值，返回一个对象。
- 每当生成一个值后，生成器就会非阻塞的挂起执行，等待下一次值的请求。
- 再次调用 `next` 方法，将生成器从挂起状态唤醒，中断执行的生成器从上次离开的位置继续执行。
- 直到遇到下一个 `yield` ，生成器挂起。
- 当执行到没有可执行代码了，就会返回一个结果对象，`value` 的值为 `undefined`, `done` 的值为 `true`，生成器执行完成。

生成器更像是一个状态运动的状态机。

- **挂起开始状态**——创建一个生成器处于未执行状态。
- **执行状态**——生成器的执行状态。
- **挂起让渡状态**——生成器执行遇到第一个 yield 表达式。
- **完成状**态——代码执行到 return 全部代码就会进入全部状态。

**执行上下文跟踪生成器函数。**

```
function* WeaponGenerator(action){
    yield "1"+action;
    yield "2";
    yield "3";
}

let Iterator = WeaponGenerator("xiaolu");
let result1 = Iterator.next()
let result2 = Iterator.next()
let result3 = Iterator.next()
复制代码
```

- 在调用生成器之前的状态——只有全局执行上下文，全局环境中除了生成器变量的引用，其他的变量都为 `undefined`。
- 调用生成器并没有执行函数，而是返回一个 `Iterator`迭代器对象并指向当前生成器的上下文。
- 一般函数调用完成上下文弹出栈，然后被摧毁。当生成器的函数调用完成之后，当前生成器的上下文出栈，但是在全局的迭代器对象还与保持着与生成器执行上下文引用，且生成器的词法环境还存在。
- 执行 `next` 方法，一般的函数会重新创建执行上下文。而生成器会重新激活对应的上下文并推入栈中（这也是为什么标准函数重复调用时，重新从头执行的原因所在。与标准函数相比较，生成器暂时会挂起并将来恢复）。
- 当遇到 `yield`关键字的时候，生成器上下文出栈，但是迭代器还是保持引用，处于非阻塞暂时挂起的状态。
- 如果遇到 `next` 指向方法继续在原位置继续 执行，直到遇到 `return` 语句，并返回值结束生成器的执行，生成器进入结束状态。





回调函数问题

- 不能捕捉异常（错误处理困难）——回调函数的代码和开始任务代码不在同一事件循环中；
- 回调地域问题（嵌套回调）；
- 处理并行任务棘手（请求之间互不依赖）

https://wangdoc.com/es6/generator-async.html#%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%E7%9A%84%E5%B0%81%E8%A3%85