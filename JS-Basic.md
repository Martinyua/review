# js基础

### 变量类型和计算

* 题目：
  * typeof能判断哪些类型
  * == 和 ===
  * 值类型和引用类型的区别
  * 手写深拷贝 

* 值类型和引用类型

  * 基本类型：Undefined、Null、Boolean、Number、String、Symbol
  * 引用类型：Object 类型、Array 类型、Date 类型、RegExp 类型、Function 类型等等
  * js将值类型（基本类型）的存于**栈**中，将引用类型存于**堆**中。只是将引用类型的内存地址存于栈中。
  * 把一个值类型（基本类型）赋值给另一个变量时，其实是分配了一块新的内存空间，因此改变str1的值对str2没有任何影响，因为它不同于*引用类型*(变量的交换其实是交换了指向同一个内容的地址)。 
  * 引用类型的比较是**引用的比较**，即比较两个对象的**堆内存中的地址是否相同**

* **typeof**运算符

  * 用来检测一个变量是不是**基本的数据类型**
  * 能识别识别所有的值类型
  * **识别函数**
  * 判断是否是引用类型（不可细分）
  * **typeof null 为 object**

    * 原因：简单来说，`typeof null`的结果为`Object`的原因是一个`bug`。在 `javascript` 的最初版本中，使用的 `32`位系统，`js`为了性能优化，使用低位来存储变量的类型信息。在判断数据类型时，是根据机器码低位标识来判断的，**而null的机器码标识为全0**，而对象的机器码低位标识为000。所以typeof null的结果被误判为Object。

* **浅拷贝与深拷贝**

  ```js
  
  /**
   * 浅拷贝指的是将一个对象的属性值复制到另一个对象，如果有的属性为引用类型的话，那么将这个引用的地址复制给对象，
   * 浅拷贝还可以使用Object.assign和展开运算符来实现
   */
  
  function shallowCopy(object) {
      //只拷贝对象
      if (!object || typeof object !== "object") return
  
      //判断新建的object是对象还是数组
      let newObject = Array.isArray(object) ? [] : {}
  
      for (let key in object) {
          if(object.hasOwnProperty(key)){
               newObject[key] = object[key];
          }
      }
      return newObject
  }     
  
  
  /**
   * 对于深拷贝，如果遇到属性值为引用对象，则新建一个引用类型并将对应的值赋给他
   * 遇到对象则递归
   */
  
  function deepCopy(object) {
      if (!object || object === 'object') { return }
  
      let newObject = Array.isArray(object) ? [] : {}
  
      for (let key in object) {
          if (object.hasOwnProperty(key)) {
              newObject[key] = 
              typeof object[key] === "object" ? deepCopy(object[key]) : object[key]
          }
      }
      return newObject
  }
  ```

* 0.1+0.2为什么不等于0.3？

  * JavaScript使用Number类型表示数字（整数和浮点数），遵循 [IEEE 754](https://zh.wikipedia.org/wiki/IEEE_754) 标准 通过64位来表示一个数字
  * **运算过程中先按照IEEE 754转成相应的二进制，然后对阶运算**，0.1和0.2**进制转换**转换后会无限循环，截掉多余的位数后会精读丢失，由于指数位数不相同，运算时需要**对阶运算** ，这部分也可能产生精度损失
  * 解决：将浮点数转换为整数来进行计算。根据业务避免这样的代码。使用math.js库

* '1'.toString()为什么可以调用

  * ```js
    var s = new String('1');
    s.toString();
    s = null;
    ```

  1. 创建String实例

  2. 调用实例方法

  3. 执行完方法后销毁这个实例

  * 整个过程体现了**基本包装类型**的性质，而基本包装类型恰恰属于基本数据类型，包括Boolean, Number和String。

* **instanceof**

  * 判断引用类型（对象数据类型)

  * instanceof的原理是基于**原型链**的查询

  * 直接：{} instanceof Object会报错。js将{}识别为代码块

  * 对于基本数据类型不能准确判断

    >  111 instanceof Number -> false 同样的还有"xx"和true, 因为字面量值不是实例, new Number() 才是

  * **手写instanceof**

    ```js
    function myInstaceof(left, right) {
        if (typeof left !== 'object' || left === null) return false
        //getPrototypeOf可以拿到对象的原型对象
        let proto = Object.getPrototypeOf(left)
    
    
        while (true) {
            //查找至原型链尽头，如果为null则没有查找到
            if (proto === null) return false
            //查找到了则返回true
            if (proto === right.prototype) return true
            //没有找到则一直向上查找
            proto = Object.getPrototypeOf(proto)
        }
    }
    ```

### 跨域

* 参考[跨域](https://juejin.cn/post/6844903816035319815#heading-1)

### 原型链

> 那什么是原型呢？你可以这样理解：每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

* 每个对象都有一个__ proto __属性，该属性指向该对象的原型
* 每个函数（类）都有一个 prototype 属性，函数的 prototype 属性指向了一个对象，
* 函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的**实例**的原型
* constructor有原型指回构造函数
* **原型的原型**。原型也是一个对象，所有也有原型。
* 通过__ proto __相互关联起来的原型组成的链状结构就是原型链
* ![原型链示意图](./src/assets/prototype5.png)
* ![img](https://upload-images.jianshu.io/upload_images/574093-c03529e3f0943633.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/570/format/webp)

### 作用域和自由变量

- 作用域
  - 全局作用域
  - 函数作用域
  - 块级作用域（es6）
- 自由变量
  - 一个变量在当前作用域没有定义但是被使用了
  - 向上级作用域，一层一层寻找，直到找到了为止
  - 如果到了全局作用域还是没找到，就会报错 is not define

### 闭包

> 闭包就是能够读取其他函数内部变量的函数。定义在一个函数内部的函数由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。 ——阮一峰
>
> 闭包是函数和声明该函数的词法环境的组合。 ——MDN

* 一句话总结：闭包就是是由函数以及该函数创建时的词法环境组合而成的。这个环境包含了函数**创建时**能访问的所有局部变量

* 只有变量的查找是在**函数定义（创建）的地方**，向上级作用域寻找，而不是在执行的地方

* 闭包的**用途**：闭包可以用在许多地方。它的最大用处有两个

  * 一个是前面提到的可以读取**函数内部的变量**。

  * 另一个就是让这些变量的值始终**保持**在**内存**中。

  * **隐藏数据，模拟私有变量和私有方法**

    ```js
    function createCache(){
        const data = {}
      return {
          set:funtion(key,val){
              data[key] = val
          }
          get:funtion(key){
              return data[key]
          }
      }
    }
    ```

    

* 两种表现形式：

  * 函数作为返回值

    ```js
    function create(){
        let a = 100
        return funtion(){
            console.log(a)
        }
    }
    
    let fun = create()
    let a = 200
    fun() //100
    ```

    

  * 函数作为参数被传递

    ```js
    function print(fn){
        const a = 200
        fn()
    }
    const a = 100
    function fn(){
        console.log(a)
    }
    print(fn)  //100
    ```

### this

五种使用场景，this的值是在执行时决定的，而不是定义

- 作为普通函数 。指向全局window
- 使用call apply bind 调用。obj.b.apply(object, []); // this指向当前的object
  - 手写bind
- 作为对象方法被调用，指向该对象 obj.b(); // 指向obj
- class中调用 //指向当前class
- 箭头函数中的this //() =>{} //this指向当前对象
-  作为构造函数调用 var b = new Fun(); // this指向当前实例对象

### 异步和单线程

* 单线程：只能同时做一件事。异步是因为单线程而产生的。比如说遇到等待（定时器，网络请求，图片加载等）不能卡组，异步是为了解决单线程等待的问题，异步不会阻塞代码的执行
* 异步和同步的区别
  * 异步是基于js单线程的
  * 异步不会阻塞代码的执行
  * 同步会阻塞代码的执行
* Promise并不是避免了回调函数。而是把回调函数变成了串联的形式。