### class实质

es6的class实质上是prototype的语法糖。语法糖就是提供了一种全新的方式书写代码，但是其实现原理与之前的写法相同。

但是class跟ES5的定义方法有几个不用

1. class 声明的类不能变量提升。
2. 必须用new 调用
3. 他的所有的方法都是不可枚举的

#### 类的组成

- 类构造函数

  - `constructor` 方法是类的默认方法，这种方法用于创建和初始化一个由`class`创建的对象。通过 `new` 命令生成对象实例时，自动调用该方法。一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。

- 实例成员

  - 每次通过 new 调用类标识符时，都会执行类构造函数。在这个函数内部，可以为新创建的实例（ this ）添加“自有”属性。

  - 每个实例都对应一个唯一的成员对象，这意味着所有成员都**不会在原型上共享**

  - ```js
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

    

- 原型方法与访问器

  - 原型方法：为了在实例间共享方法，类定义语法把在**类块中定义的方法**作为 原型方法。

  - 类定义也支持获取和设置访问器。

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

    

- 静态方法

  - `static` 关键字用来定义一个类的一个静态方法。调用静态方法**不需要实例化**该类，但**不能通过一个类实例调用静态方法**。静态方法通常用于为一个应用程序创建工具函数。

- 非函数原型和类成员

  - 虽然类定义并不显式支持在原型或类上添加成员数据，但在类定 义外部，可以手动添加

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

    

- 继承