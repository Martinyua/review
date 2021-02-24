# This

- 在ES5中，**this永远指向最后调用它的那个对象**（关键词：**最后**）

  - 具体来说就是普通函数，1.全局中调用，指向window。2.作为对象的方法调用，指向该对象3.作为构造函数执行当前的实例对象

  - ```js
    var name = "windowsName";
        var a = {
            name: "Cherry",
            fn : function () {
                console.log(this.name);      // Cherry
            }
        }
        window.a.fn();
    //最后调用它的是fn
    ```

  - ```js
        var name = "windowsName";
        var a = {
            // name: "Cherry",
            fn : function () {
                console.log(this.name);      // undefined
            }
        }
        window.a.fn();
    ```

    **this 永远指向最后调用它的那个对象**，因为最后调用 fn 的对象是 a，所以就算 a 中没有 name 这个属性，也**不会**继续向上一个对象寻找 `this.name`，而是直接输出 `undefined`。



#### 改变this指向

- 共有四种方法：
  1. 使用ES6箭头函数
  2. 函数内部使用`_this = this`
  3. 使用apply,call,bind
  4. new实例化一个对象
- **箭头函数中的this**
  - ES6 的箭头函数是可以避免 ES5 中使用 this 的坑的。**箭头函数的 this 始终指向函数定义时的 this，而非执行时。** 箭头函数中**没有this绑定，必须通过查找作用域链决定其值，如果箭头函数被非箭头函数包含，则this绑定的是最近一层非箭头函数的this，否则this为undefined**。比如可以用箭头函数来解决setTimeout中的this指向全局window的问题
- call、apply、bind
  - 相同点：
    - 三者都是用来改变this指向的
    - 三者的第一个参数都是this要指向的对象
    - 三者都可以利用后续参数传参
  - 不同点：
    - bind是**返回对应的函数**，便于后续调用，apply、call则是立刻调用
    - call需要把参数按顺序传递，apply则是把参数放在**数组**里