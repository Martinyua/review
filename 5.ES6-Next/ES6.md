### var let const 区别

#### 变量提升

1. var声明变量存在**变量提升**，let和const不存在变量提升（实际上是存在的。我认为应该尊重 ES 文档，认为 let 确实存在提升。只不过由于**暂时死区的限制**，你不能在 let x 之前使用 let）

   ```js
   console.log(a); // undefined  ===>  a已声明还没赋值，默认得到undefined值
   var a = 100;
   
   console.log(b); //Uncaught ReferenceError：b is not defined  ===> 找不到b这个变量
   let b = 10;
   ```

#### 块级作用域

2. let 和 const声明形成**块级作用域**

```js
if(1){
    var a = 100;
    let b = 10;
}

console.log(a); // 100
console.log(b)  // 报错：b is not defined  ===> 找不到b这个变量
```
#### 不可重复声明
3. 同一作用域下let和const**不能声明同名变量**，而var可以
#### 暂时性死区
4. **暂时性死区**：只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，**只有等到声明变量的那一行代码出现，才可以获取和使用该变量**

   ```js
   var tmp = 123; // 声明
   if (true) {
     tmp = 'abc'; // 报错 因为本区域有tmp声明变量
     let tmp; // 绑定if这个块级的作用域 不能出现tmp变量
   }
   
   ```

   为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。
#### 不挂在到全局对象下
5. let、const声明的全局变量**不会挂在顶层对象下面**

#### const注意点

1. **一旦声明，必须马上赋值**

```
let p; var p1; // 不报错
const p3 = '马上赋值'
const p3; // 报错 没有赋值
```

2. const一旦声明就不能改变
   * 基本类型：不能改动
   * 复杂类型：变量指针不能改变

#### let、const使用场景:

1. `let`使用场景：变量，用以替代`var`。
2. `const`使用场景：常量、声明匿名函数、箭头函数的时候。

var和let的区别，面试老生常谈的问题，大多数人回答可能就是作用域和变量提升这两点不同，少有人能够知道内在原理，这样的回答面试官会满意吗？（手动滑稽）

我们就从声明过程，内存分配，和变量提升这三点来看这三者之间的区别。

一.声明过程
var：遇到有var的作用域，在任何语句执行前都已经完成了声明和初始化，也就是变量提升而且拿到undefined的原因由来
function： 声明、初始化、赋值一开始就全部完成，所以函数的变量提升优先级更高
let：解析器进入一个块级作用域，发现let关键字，变量只是先完成声明，并没有到初始化那一步。此时如果在此作用域提前访问，则报错xx is not defined，这就是暂时性死区的由来。等到解析到有let那一行的时候，才会进入初始化阶段。如果let的那一行是赋值操作，则初始化和赋值同时进行
const、class都是同let一样的道理
比如解析如下代码步骤：

{
// 没用的第一行
// 没用的第二行
console.log(a) // 如果此时访问a报错 a is not defined
let a = 1
}
步骤：

发现作用域有let a，先注册个a，仅仅注册
没用的第一行
没用的第二行
a is not defined，暂时性死区的表现
假设前面那行不报错，a初始化为undefined
a赋值为1
对比于var，let、const只是解耦了声明和初始化的过程，var是在任何语句执行前都已经完成了声明和初始化，let、const仅仅是在任何语句执行前只完成了声明。

二.内存分配
var，会直接在栈内存里预分配内存空间，然后等到实际语句执行的时候，再存储对应的变量，如果传的是引用类型，那么会在堆内存里开辟一个内存空间存储实际内容，栈内存会存储一个指向堆内存的指针

let，是不会在栈内存里预分配内存空间，而且在栈内存分配变量时，做一个检查，如果已经有相同变量名存在就会报错

const，也不会预分配内存空间，在栈内存分配变量时也会做同样的检查。不过const存储的变量是不可修改的，对于基本类型来说你无法修改定义的值，对于引用类型来说你无法修改栈内存里分配的指针，但是你可以修改指针指向的对象里面的属性

三.变量提升
let const 和var三者其实会存在变量提升

let只是创建过程提升，初始化过程并没有提升，所以会产生暂时性死区。
var的创建和初始化过程都提升了，所以在赋值前访问会得到undefined
function 的创建、初始化、赋值都被提升了

### Object

**Object.keys(obj)** —— 返回一个包含该对象所有的键的**字符串数组。**
**Object.values(obj)** ——成员是参数对象自身的（**不含继承的**）所有**可遍历**属性的**键值**
**Object.entries(obj)** —— 返回一个数组，成员是参数对象自身的（不含继承的）所有**可遍历**属性的**键值对数组**

```js
let obj={name:"小白",age:18,sex:"男"}
let newobj=Object.entries(obj)
console.log(newobj)//[["name", "小白"],["age", 18],["sex", "男"]]
```

### class实质

es6的class实质上是prototype的语法糖。语法糖就是提供了一种全新的方式书写代码，但是其实现原理与之前的写法相同。

但是class跟ES5的定义方法有几个不用

1. class 声明的类不能变量提升。
2. 必须用new 调用
3. 他的所有的方法都是不可枚举的

#### 类的组成

* 类构造函数

  * `constructor` 方法是类的默认方法，这种方法用于创建和初始化一个由`class`创建的对象。通过 `new` 命令生成对象实例时，自动调用该方法。一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。

* 实例成员

  * 每次通过 new 调用类标识符时，都会执行类构造函数。在这个函数内部，可以为新创建的实例（ this ）添加“自有”属性。

  * 每个实例都对应一个唯一的成员对象，这意味着所有成员都**不会在原型上共享**

  * ```js
    class Person {
      constructor() {
        // 这个例子先使用对象包装类型定义一个字符串
        // 为的是在下面测试两个对象的相等性
        this.name = new String('Jack')
        this.sayName = () => console.log(this.name)
        this.nicknames = ['Jake', 'J-Dog']
      }
    }
    ```

    

* 原型方法与访问器

  * 原型方法：为了在实例间共享方法，类定义语法把在**类块中定义的方法**作为 原型方法。

  * 类定义也支持获取和设置访问器。

    ```js
    class Person {
      set name(newName) {
        this.name_ = newName
      }
      get name() {
        return this.name_
      }
    }
    let p = new Person()
    p.name = 'Jake'
    console.log(p.name) // Jake
    ```

    

* 静态方法

  * `static` 关键字用来定义一个类的一个静态方法。调用静态方法**不需要实例化**该类，但**不能通过一个类实例调用静态方法**。静态方法通常用于为一个应用程序创建工具函数。

* 非函数原型和类成员

  * 虽然类定义并不显式支持在原型或类上添加成员数据，但在类定 义外部，可以手动添加

    ```js
    class Person {
      sayName() {
        console.log('${Person.greeting}${this.name}')
      }
    }
    // 在类上定义数据成员
    Person.greeting = 'My name is'
    // 在原型上定义数据成员
    Person.prototype.name = 'Jake'
    let p = new Person()
    p.sayName() // My name is Jake
    ```

    

* 继承

### Generator/协程/yield/co模块

#### Generator

简单理解：可以中断的函数 

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

* **生成器**对象还有以下两个方法：return和throw
  * return：和迭代器接口的return方法一样，**用于在生成器函数执行过程中遇到异常或者提前中止**（比如在for...of循环中未完成时提前break）时自动调用，同时生成器对象变为**终止态**，无法再继续产生值。
  * throw：throw方法。调用此方法会在生成器函数当前暂停执行的位置处抛出一个错误。

  

#### yield

  * 遇到 yield 表达式，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值。
  * 下次调用 next 方法时，再继续往下执行，直到遇到下一个 yield 表达式。
  * 如果没有再遇到新的 yield 表达式，就一直运行到函数结束，知道 return语句为止，并将return语句后面的表达式的值，作为返回对象的 value的值。
  *  如果没有return 语句，则返回的对象 value 属性值为 undefined。
  * 在generator函数中调用generator：yield *

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

### Iterator接口

见JS篇

### Symbol

见JS篇

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

* resolve的作用是将pending变为resolved，在异步操作成功时调用，并将结果传递出去
* reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

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

* **Promise.prototype.then方法**

  * ```
    promise.then(
      function(value) {
        // success
      },
      function(error) {
        // failure
      }
    )
    ```

  * then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数

  * then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用**链式写法**，即 then 方法后面再调用另一个 then 方法。如果return的不是Promise对象，也会被封装成一个Promise对象（一般用于后一个请求依赖于前一个请求的结果时）

    ```js
    getJSON('/posts.json')
      .then(function(json) {
        return json.post
      })
      .then(function(post) {
        // ...
      })
    ```

* **Promise.prototype.catch方法**

  * Promise.prototype.catch 方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
  * Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

* **finally方法**

  ```js
  promise
  .then(result => {···})
  .catch(error => {···})
  .finally(() => {···});
  ```

  finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。

* **Promise.resolve()**

  * 有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。

    ```js
    const jsPromise = Promise.resolve($.ajax('/whatever.json'))
    ```

* **Promise.all**

  * 接受一个可迭代对象，返回一个新的Promise

  * 在前端的开发实践中，我们有时会遇到需要发送多个请求并根据请求顺序返回数据的需求，比如，我们要发送a、b、c三个请求，这三个请求返回的数据分别为a1、a2、a3，而我们想要a1、a2、a3按照我们希望的顺序返回。

  * 当对象里的所有 Promise 都 resolve 时，返回的 Promise 也会 resolve。当有一个reject时，返回的Promise会立刻reject

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

    

* **Promise.race**

  * Promise 接受一个可迭代对象，里面的 Promise 是竞争关系，谁先 resolve 或者 reject 立刻会被当做返回值返回到外部。其他会 settled 的 Promise 会继续执行但不会再影响结果。

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

    

### async/await

#### 使用

在我们处理异步的时候，比起回调函数，Promise的then方法会显得较为简洁和清晰，但是在处理多个**彼此之间相互依赖的请求的时候**，就会显的有些累赘。这时候，用async和await更加优雅

* 规则一：凡是在前面添加了async的函数在执行后都会返回一个Promise对象

```js
async function test() {
    
}

let result = test()
console.log(result)  //即便代码里test函数什么都没返回，我们依然打出了Promise对象
```

* 规则二：await必须在async函数里使用，不能单独使用
* 规则三：await后面需要跟**Promise对象**，不然就没有意义，而且await后面的Promise对象不必写then，因为await的作用之一**就是获取后面Promise对象成功状态传递出来的参数。**



#### 比Promise链式调用更加优雅：

在前端编程中，我们偶尔会遇到这样一个场景：我们需要发送多个请求，而**后面请求的发送总是需要依赖上一个请求返回的数据**。对于这个问题，我们既可以用的Promise的链式调用来解决，也可以用async/await来解决，然而后者会更简洁些。

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

### Decorator 

什么是装饰器：

> 装饰器是一种特殊的声明，可附加在类、方法、访问器、属性、参数声明上。

#### 类装饰器

类装饰器的三种类型：

* 普通装饰器（无法传值）

  * **target就是装饰的那个类**

  ```js
  function helloWord(target: any) {
      console.log('hello Word!');
      target.prototype.name = 'xxx'
  }
  
  @helloWord
  class HelloWordClass {
      constructor() {
          console.log('我是构造函数')
      }
      name: string = 'zzb';
  }
  ```

  

* 装饰器工厂（可传参）

  * **需要返回一个函数**，返回的函数的参数就是装饰的那个类

  ```js
  function helloWord(isTest: boolean) {
      return function(target: any) {
          // 添加静态变量
          target.isTestable = isTest;
      }
  }
  
  @helloWord(false)
  class HelloWordClass {
      constructor() {
          console.log('我是构造函数')
      }
      name: string = 'zzb';
  }
  let p = new HelloWordClass();
  console.log(HelloWordClass.isTestable);
  ```

  

* 重载构造函数

  * **返回一个class继承target**

  ```js
  function helloWord(target: any) {
      return class extends target {
          sayHello(){
              console.log("Hello")
          }
      }
  }
  
  @helloWord
  class HelloWordClass {
      constructor() {
          console.log('我是构造函数')
      }
      name: string = 'zzb';
  }
  ```

  

#### 属性装饰器

* 属性装饰器表达式会在运行时当作函数被调用，由定义知道，传入2个参数：
  1. `target` —— 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**。
  2. `propertyKey` —— 属性的名称。
     没有返回值。

```js
function defaultValue(value: string) {
    return function (target: any, propertyName: string) {
        target[propertyName] = value;
    }
}

class HelloWordClass {
    constructor() {
        console.log('我是构造函数')
    }
    @defaultValue('xxx')
    private name: string | undefined;
}
let p = new HelloWordClass();
console.log(p.name); //xxx

```



#### 方法装饰器

方法装饰器有三个参数：

* **target** —— 当前类的**原型对象**，也就是说，假设 Employee 是对象，那么 target 就是 `Employee.prototype`
* **propertyKey** —— 当前方法的名称
* **descriptor** —— 方法的属性描述符，即 `Object.getOwnPropertyDescriptor(Employee.prototype, propertyKey)`

#### 参数装饰器

方法参数装饰器会接收三个参数：

1. target —— 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**。
2. propertyKey —— 当前方法的名称。
3. parameterIndex —— 参数数组中的位置。

### map/set/weakSet/weakMap

- **Set**
  - 成员**唯一**、**无序**且**不重复**
  - [value, value]，**键值与键名是一致的**（或者说只有键值，没有键名）
  - 可以遍历，方法有：add、delete、has
  - 遍历方法
    - `Set.prototype.keys()`：返回键名的遍历器（和键值一样）
    - `Set.prototype.values()`：返回键值的遍历器
    - `Set.prototype.entries()`：返回键值对的遍历器
    - `Set.prototype.forEach()`
- **WeakSet**
  - 成员**都是对象，不能存放值**
  - 成员都是**弱引用**，可以**被垃圾回收机制回收**，可以用来保存DOM节点，不容易造成内存泄漏
  - **不能遍历**，方法有add、delete、has
- **Map**
  - 本质上是键值对的集合，类似集合
  - 集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存
  - 可以遍历，方法很多可以跟各种数据格式转换
- **WeakMap**
  - 只接受**对象作为键名**（null除外），不接受**其他类型的值作为键名**
  - **键名是弱引用，键值可以是任意的**，键名所指向的对象**可以被垃圾回收**，此时键名是无效的
  - **不能遍历**，方法有get、set、has、delete



`WeakMap`与`Map`的区别有两点。

首先，`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。

其次，`WeakMap`的键名所指向的对象，不计入垃圾回收机制。

`WeakMap`的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子。

```javascript
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素'],
];
```

上面代码中，`e1`和`e2`是两个对象，我们通过`arr`数组对这两个对象添加一些文字说明。这就形成了`arr`对`e1`和`e2`的引用。

一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放`e1`和`e2`占用的内存。

总之，`WeakMap`的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap`结构有助于防止内存泄漏。

### Proxy

