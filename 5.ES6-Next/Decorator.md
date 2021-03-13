### Decorator 

什么是装饰器：

> 装饰器是一种特殊的声明，可附加在类、方法、访问器、属性、参数声明上。

#### 类装饰器

类装饰器的三种类型：

- 普通装饰器（无法传值）

  - **target就是装饰的那个类**

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

  

- 装饰器工厂（可传参）

  - **需要返回一个函数**，返回的函数的参数就是装饰的那个类

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

  

- 重载构造函数

  - **返回一个class继承target**

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

- 属性装饰器表达式会在运行时当作函数被调用，由定义知道，传入2个参数：
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

- **target** —— 当前类的**原型对象**，也就是说，假设 Employee 是对象，那么 target 就是 `Employee.prototype`
- **propertyKey** —— 当前方法的名称
- **descriptor** —— 方法的属性描述符，即 `Object.getOwnPropertyDescriptor(Employee.prototype, propertyKey)`

#### 参数装饰器

方法参数装饰器会接收三个参数：

1. target —— 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**。
2. propertyKey —— 当前方法的名称。
3. parameterIndex —— 参数数组中的位置。