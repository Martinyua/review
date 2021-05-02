> 【好文收藏】：原文地址：[React中的Transation](https://oychao.github.io/2017/09/25/react/16_transaction/)
>
> 【推荐阅读】：[Dive into React codebase: Transactions](https://reactkungfu.com/2015/12/dive-into-react-codebase-transactions/)

### 概述

[参考1](http://reactkungfu.com/2015/12/dive-into-react-codebase-transactions/)中介绍了Transaction在React中的应用，虽然Transaction在React中有大量的应用，但本文并不打算介绍它们，而是希望在一个脱离React的背景下来分析Transaction。

**为什么要引入Transaction呢？**举个简单的例子，有的时候我们在做真正的业务之前，经常需要进行验证，授权，或者输出日志的操作，也就是在主要的逻辑代码之前或者之后插入一些代码，这时候就是Transaction登场的时候了，如果你熟悉**AOP**（面向切面编程）的话，这些例子你一定不会陌生。

### 源码

不多赘述，上源码。

```js
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

var OBSERVED_ERROR = {};

/**
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 */
var TransactionImpl = {
  reinitializeTransaction: function () {
    this.transactionWrappers = this.getTransactionWrappers();
    if (this.wrapperInitData) {
      this.wrapperInitData.length = 0;
    } else {
      this.wrapperInitData = [];
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  getTransactionWrappers: null,

  isInTransaction: function () {
    return !!this._isInTransaction;
  },

  perform: function (method, scope, a, b, c, d, e, f) {
    !!this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction.') : _prodInvariant('27') : void 0;
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          try {
            this.closeAll(0);
          } catch (err) {}
        } else {
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function (startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      try {
        this.wrapperInitData[i] = OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[i] === OBSERVED_ERROR) {
          try {
            this.initializeAll(i + 1);
          } catch (err) {}
        }
      }
    }
  },

  closeAll: function (startIndex) {
    !this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.closeAll(): Cannot close transaction when none are open.') : _prodInvariant('28') : void 0;
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        errorThrown = true;
        if (initData !== OBSERVED_ERROR && wrapper.close) {
          wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        if (errorThrown) {
          try {
            this.closeAll(i + 1);
          } catch (e) {}
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

module.exports = TransactionImpl;
```

流程图描述了Transaction的核心功能，**Transaction的主要作用就是包装一个函数，函数的执行交给Transaction，同时Transaction会在函数执行前后执行被注入的Wrapper，一个Wrapper要求有initialize和close两个方法。**

### 代码的基本结构

#### 相关依赖

在源码的开头可以看到，Transaction一共依赖了两个外部文件或库，分别是_prodInvariant和invariant，如果去看这两个文件或库的源码会发现，它们的实现都不难，它们的作用都是用于**处理抛出错误信息**的，只不过一个（前者）用于处理生产环境下的错误抛出，而后者用于开发环境下。

#### 几个关键方法

从上述代码中可以看到，Transaction主要有四个方法，分别是reinitializeTransaction，perform，initializeAll，closeAll。

1. **perform**方法是执行被目标函数的主要方法，其作用类似于method.call，当然它还处理了initialize方法（在被目标函数执行之前被指定的方法）和close方法（被包装函数执行之后被指定的方法）。
2. **initializeAll**在perform中被调用，它用于处理所有Wrapper的initialize方法。
3. **closeAll**也在perform中被调用，它用于处理所有Wrapper的close方法。
4. **reinitializeTransaction**，清除，或者说重置当前Transaction的残余数据，在Transaction的实现中，上一次调用后的一些残余数据需要通过这个方法来清除。

### 关键源码的详解

#### perform

```js
// ...
perform: function (method, scope, a, b, c, d, e, f) {
  !!this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction.') : _prodInvariant('27') : void 0;
  var errorThrown;
  var ret;
  try {
    this._isInTransaction = true;
    errorThrown = true;
    this.initializeAll(0);
    ret = method.call(scope, a, b, c, d, e, f);
    errorThrown = false;
  } finally {
    try {
      if (errorThrown) {
        try {
          this.closeAll(0);
        } catch (err) {}
      } else {
        this.closeAll(0);
      }
    } finally {
      this._isInTransaction = false;
    }
  }
  return ret;
}
// ...
```

这里的perform是执行被目标函数的主要方法，它一共接收8个参数，其中第1个参数method是目标函数，即我们需要执行的函数；第2个参数scope即目标函数执行的this的环境，后面跟了6个参数，是method的参数，注意这里完全可以使用函数的内置变量arguments实现，但是React认为整个框架中不会有用Transaction执行参数长度超过6个的函数，所以React规定了这里只能调用6个参数。

在函数中，首先函数内部的第1行是两个嵌套的三元运算符，如果this.isInTransaction()，则根据是否是开发环境确定错误信息并抛出错误，否则不执行任何语句。isInTransaction()的代码如下。

```js
// ...
isInTransaction: function () {
  return !!this._isInTransaction;
}
// ...
```

这里返回了一个内部变量_isInTransaction，该变量用于记录当前事务是否正在执行，配合perform，不难发现这个变量是用来给Transaction加锁的，保证当前的Transaction正在perform的同时不会再次被perform。

接着继续看perform，函数内的第2行和第3行定义了两个变量，errorThrown用于记录执行过程中是否抛出错误，ret用于记录目标函数执行之后的返回值。

第5行设置内部变量_isInTransaction为true，加锁。

第6行假定执行过程中抛出错误。

第7行this.initializeAll(0)，调用所有wrapper的initialize方法，这个我们会在后面的小节中详细分析。

第8行才是真正的执行目标函数，执行后记录返回结果。

第9行，重新设定errorThrown为false，即标记执行过程中没有抛出错误。结合第6行和第9行一起看，会发现这是React的开发人员设置的一个小魔法。整个try代码块后面并没有catch代码块，这样就会使得错误不会被捕获，而是被正常抛出，但是如果发生了错误我们又需要知道，并且还要保证后续的closeAll继续执行，所以errorThrown用于记录wrapper初始化和目标函数执行的过程是否报错。

第6行假定它是报错的，如果真的报错了，那么第10行不会执行，这样可以顺利地执行后面finally代码块中的相关处理。

然后再之后是一个嵌套的的finally代码块，这里把它单独拿出来分析。

```js
// ...
finally {
  try {
    if (errorThrown) {
      try {
        this.closeAll(0);
      } catch (err) {}
    } else {
      this.closeAll(0);
    }
  } finally {
    this._isInTransaction = false;
  }
}
// ...
```

可以看到，如果errorThrown是真，则表明上面代码的执行过程中确实抛出了错误，这时正常执行this.closeAll(0)，也就是所有wrapper中的close函数会被调用，但是注意如果此时close再抛出错误，代码虽然捕获了，但是并不会处理。

而如果初始化和目标函数执行过程中不抛出错误，则依然执行this.closeAll(0)，只是此时如果再抛出错误的话，错误就会真的向上抛出了。

为什么要这么设计呢？我们已经知道了Transaction会按照顺序执行initializeAll，method.call，closeAll(0)，但是这个执行过程中可能会报错误，Transaction采用这种设计保证了我们只获取抛出的第一个错误，如果整个执行过程中还有错误，则不管。

嵌套的finally块的最后，this._isInTransaction = false，解锁。

再之后就是perform的最后一句话了，返回记录下的执行结果，当然如果执行过程中出现了错误，ret就是undefined了。

#### initializeAll

在perform中调用目标函数的代码之前，initializeAll被调用了，前面说过，initializeAll就是用于调用所有绑定的wrapper的initialize方法的（按照wrapper数组的顺序）。

```js
// ...
initializeAll: function (startIndex) {
  var transactionWrappers = this.transactionWrappers;
  for (var i = startIndex; i < transactionWrappers.length; i++) {
    var wrapper = transactionWrappers[i];
    try {
      this.wrapperInitData[i] = OBSERVED_ERROR;
      this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
    } finally {
      if (this.wrapperInitData[i] === OBSERVED_ERROR) {
        try {
          this.initializeAll(i + 1);
        } catch (err) {}
      }
    }
  }
}
// ...
```

可以看到initializeAll方法接收了一个参数startIndex，该参数表示从第几个wrapper的initialize开始执行，如果你熟悉递归函数，应该回想起很多递归函数也有类似结构，而我们后面会看到，initializeAll实际上也确实是一个递归函数。

函数一开始用一个变量拿到当前所有的wrapper，然后开始遍历所有wrapper。

这里的this.wrapperInitData用于记录各个initialize调用的返回值，但是对于当前的wrapper，一开始是被赋值了一个OBSERVED_ERROR的变量，通过查看之前的源码可以发现，这里的OBSERVED_ERROR是一个空对象，仔细看后面的finally代码块中会发现，这个结构和perform的设计很相像，是的，这个空对象的作用就是用于记录initialize方法调用过程中是否抛出了错误，如果抛错，this.wrapperInitData[i]依然会是OBSERVED_ERROR，方便之后在finally代码块中进行处理，如果没有错误，则判断wrapper.initialize是否存在，存在则调用并返回且记录，否则为空。

在finally代码块中，如果报错，则递归调用自身，游标向前加1，此时抛出的错误不再处理。

#### closeAll

```js
// ...
closeAll: function (startIndex) {
  !this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.closeAll(): Cannot close transaction when none are open.') : _prodInvariant('28') : void 0;
  var transactionWrappers = this.transactionWrappers;
  for (var i = startIndex; i < transactionWrappers.length; i++) {
    var wrapper = transactionWrappers[i];
    var initData = this.wrapperInitData[i];
    var errorThrown;
    try {
      errorThrown = true;
      if (initData !== OBSERVED_ERROR && wrapper.close) {
        wrapper.close.call(this, initData);
      }
      errorThrown = false;
    } finally {
      if (errorThrown) {
        try {
          this.closeAll(i + 1);
        } catch (e) {}
      }
    }
  }
  this.wrapperInitData.length = 0;
}
// ...
```

接下来是closeAll方法，该函数也有一个参数startIndex，和initializeAll方法一样，这也是一个递归调用的函数，startIndex表示从wrapper关闭的序号（一般从0开始）。

首先依然是处理错误信息，然后获取所有的wrapper，对于每一个wrapper（从startIndex开始），判断是否其调用initialize方法的返回结果是否是OBSERVED_ERROR，如果成立则表示initialize出错，（或者wrapper不存在close时），不执行close方法，errorThrown很明显，和之前的代码一样，用于标记执行过程中是否抛出错误。

最后，如果抛出错误，则当前急需执行后续wrapper的close方法，但如果之后还抛出错误，则不再做任何处理。

#### reinitializeTransaction

```js
// ...
reinitializeTransaction: function () {
  this.transactionWrappers = this.getTransactionWrappers();
  if (this.wrapperInitData) {
    this.wrapperInitData.length = 0;
  } else {
    this.wrapperInitData = [];
  }
  this._isInTransaction = false;
}
// ...
```

最后一个关键的方法是reinitializeTransaction，它必须在每一次执行当前事务之前被调用，因为很明显，如果一个事务之前的被调用过，我们并没有清楚其wrapperInitData中的数据，所以需要调用一遍这个方法。

需要说明的是，第一句话调用了getTransactionWrappers的，而Transaction中的getTransactionWrappers是null

```js
// ...
getTransactionWrappers: null
// ...
```

熟悉设计模式的同学可能已经发现了，Transaction并不是一个可以直接使用的对象，它只是一个抽象的实现，实际上在React中的各种事务也确实是把它当成一个mixin在用，通过Object.assign将Transaction中的所有属性都交给一个实现了getTransactionWrappers的对象（通常是一个构造函数的prototype对象，该构造函数的第一句话就是执行reinitializeTransaction方法，因为它必须在每一次执行之前被调用），这一步之后得到的对象才是可以执行的Transaction。

Transaction有点像Java中的抽象类，已经实现了了一些方法（reinitializeTransaction, initializeAll, perform, closeAll等），还有需要待『继承的对象』去实现的『抽象方法』（getTransactionWrappers）。

### 实例

现在既然我们已经对Transaction已经进行了详细地分析，我们来看看如何使用它。

先把Transaction的代码从React中复制粘贴出来，由于Transaction本身有两个依赖（invariant仅处理跑错，不影响业务逻辑），我们把相关的代码都去掉，然后把剩下的代码单独保存为一个文件。

然后我们新建一个js文件，代码如下。

```js
const Transaction = require('../Transaction.js');

const wrappers = [{
  initialize() {
    console.log(`wrapper 1: ${this.name} initialize`);
  },
  close() {
    console.log(`wrapper 1: ${this.name} close`);
  }
}, {
  initialize() {
    console.log(`wrapper 2: ${this.name} initialize`);
  },
  close() {
    console.log(`wrapper 2: ${this.name} close`);
  }
}];

function MyTransaction() {
  this.reinitializeTransaction();
  this.name = 'Ouyang';
}

Object.assign(MyTransaction.prototype, Transaction, {
  getTransactionWrappers() {
    return wrappers;
  }
});

const myTransaction = new MyTransaction();

const ret = myTransaction.perform(function(a, b) {
  console.log(`performing: ${this.name} is calculating: a + b = ${a + b}`);
  return a + b;
}, myTransaction, 1, 2);

console.log(`the result is ${ret}`);
```

首先我们定义了一个数组，里面包含了两个wrapper，两个wrapper都有initialize方法和close方法，都只做了见到的日志输出逻辑。

然后定义了MyTransaction构造函数，该函数首先执行的reinitializeTransaction方法，然后设置了一个属性name。

接着讲Transaction和实现了getTransactionWrappers方法的对象都合并到MyTransaction.prototype中，这样，所有的MyTransaction对象就都有，且能顺利执行reinitializeTransaction方法了。

新建一个MyTransaction的对象myTransaction，使用myTransaction执行一个加法函数，则该函数会依次输出的结果如下。

```js
wrapper 1: initialize
wrapper 2: initialize
performing: Ouyang is calculating: a + b = 3
wrapper 1: close
wrapper 2: close
the result is 3
```

第1，2行分别是依次执行两个wrapper的initialize方法时的输出结果，第3行是执行目标函数的输出结果，第4，5行分别是依次执行close方法时的输出结果，最后第6行，我们将perform方法（也就是目标函数）返回的结果再次进行了输出。

### 总结

事务Transaction是想要React源码中的核心概念之一，想要深入了解React的同学，应该对Transaction有一定的了解，Transaction的源码其实大多数都是为了处理抛出错误用的，实际上如果除去错误处理，理解起来会更加容易，也希望本文对和我一样的React初心者有所帮助。