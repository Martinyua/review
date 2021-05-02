> 记录几个常见 且好记的

### ES10

1. `Array.flat()`数组扁平化
2. `String.trimStart()`和`String.trimEnd()`去除字符串首尾空白符
3. `Symbol.prototype.description`只读属性，返回Symbol对象的可选描述的字符串

### ES11

1. 空值处理。在`??`左侧的如果为null或者undefined，则返回其右侧

   ```
   let user = {
       u1: 0,
       u2: false,
       u3: null,
       u4: undefined
       u5: '',
   }
   let u2 = user.u2 ?? '用户2'  // false
   let u3 = user.u3 ?? '用户3'  // 用户3
   let u4 = user.u4 ?? '用户4'  // 用户4
   let u5 = user.u5 ?? '用户5'  // ''
   ```

2. Promise.allSettled

   all和race并不能满足我们的需求。比如我们在所有的promise都结束时做一些操作。而不在乎他们是成功还是失败。

   `Promise.allSettled()` 方法返回一个在所有给定的 `promise` 都已经 `fulfilled` 或 `rejected` 后的 `promise` ，并带有一个**对象数组**，每个对象表示对应的 `promise` 结果。

   ```
   const promise1 = Promise.resolve(100);
   const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'info'));
   const promise3 = new Promise((resolve, reject) => setTimeout(resolve, 200, 'name'))
   
   Promise.allSettled([promise1, promise2, promise3]).
       then((results) => console.log(result));
   /* 
       [
           { status: 'fulfilled', value: 100 },
           { status: 'rejected', reason: 'info' },
           { status: 'fulfilled', value: 'name' }
       ]
   */
   
   ```

3. BigInt

   以前js的最大安全数是2^53 -1。如果大于或等于2的1024次方的数组，js无法表示。会返回 `Infinity`。

   `BigInt`解决来了这两个问题

   用法：为了和Number进行区分，bigInt类型的数据必须添加后缀n

   ```
   //Number类型在超过9009199254740991后，计算结果即出现问题
   const num1 = 90091992547409910;
   console.log(num1 + 1); //90091992547409900
   
   //BigInt 计算结果正确
   const num2 = 90091992547409910n;
   console.log(num2 + 1n); //90091992547409911n
   
   ```

4. **动态导入**

   标准用法的 `import` 导入的模块是静态的，会使所有被导入的模块，在加载时就被编译（无法做到按需编译，降低首页加载速度）。有些场景中，你可能希望根据条件导入模块或者按需导入模块，这时你可以使用动态导入代替静态导入。

   在 `import()` 之前，当我们需要根据条件导入模块时，不得不使用 `require()`。

   ```
   if(XXX) {
       const menu = import('./menu');
   }
   ```

   另外import()返回的是一个对象

5. `GlobalThis`

   在webWorker，浏览器环境，node环境获取全局对象的方法不同。需要通过判断来获取 

   ```
   var getGlobal = function () {
       if (typeof self !== 'undefined') { return self; }
       if (typeof window !== 'undefined') { return window; }
       if (typeof global !== 'undefined') { return global; }
       throw new Error('unable to locate global object');
   };
   
   ```

   `globalThis` 作为顶层对象，在任何环境下，都可以简单的通过 `globalThis` 拿到顶层对象。

### ES12

1. `replaceAll` 返回一个全新的字符串，所有符合规则的字符都会被替换掉

   ```
   const str = 'hello world';
   str.replaceAll('l', ''); // "heo word"
   ```

2. promise.any

   > 当Promise列表里面的任一个promise成功resolve则返回一个resolve的结果状态。如果所有的promise均reject，则抛出异常表示所有请求失败

   ```
   Promise.any([
     new Promise((resolve, reject) => setTimeout(reject, 500, '哎呀，我被拒绝了')),
     new Promise((resolve, reject) => setTimeout(resolve, 1000, '哎呀，她接受我了')),
     new Promise((resolve, reject) => setTimeout(resolve, 2000, '哎呀，她也接受我了')),
   ])
   .then(value => console.log(`输出结果: ${value}`))
   .catch (err => console.log(err))
   
   //输出
   //输出结果:哎呀，她接受我了
   
   ```

3. 运算符新用法

   ```
   a ||= b
   //等价于
   a = a || (a = b)
   
   a &&= b
   //等价于
   a = a && (a = b)
   
   a ??= b
   //等价于
   a = a ?? (a = b)
   
   ```

4. 数字分隔符

   > 数字分隔符，可以在数字之间创建可视化分隔符，通过_下划线来分割数字，使数字更具可读性

   ```
   const money = 1_000_000_000
   //等价于
   const money = 1000000000
   
   const totalFee = 1000.12_34
   //等价于
   const totalFee = 1000.1234
   
   ```

   