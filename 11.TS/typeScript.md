### 为什么要typeScript

* TS对应JS的改进主要是静态类型检查，静态类型更有利于构建大型应用
  * **便于查错**，一旦代码发生类型不匹配，语言在编译阶段即可发现
  * 对于阅读代码友好。针对大型应用，方法众多，调用关系复杂，不可能每个函数都有人编写细致的文档，所以静态类型就是非常重要的**提示和约束。**
  * `VSCode` 会给你自动提示支持的参数和类型等

### interface VS type

#### 相同点

##### 都可以描述一个对象或者函数

但是语法不同

**interface**

```
interface User {
  name: string
  age: number
}

interface SetUser {
  (name: string, age: number): void;
}
```

**type**

```ts
type User = {
    name:string
    age:number
}
type SetUser = (name:string,age:number) => void
```



##### 都允许拓展（extends）

 interface 可以 extends type, type 也可以 extends interface 。 **虽然效果差不多，但是两者语法不同**。

* **interface extends interface**

  ```ts
  interface Name { 
    name: string; 
  }
  interface User extends Name { 
    age: number; 
  }
  ```

* **type extends type**

  ```ts
  type Name = { 
    name: string; 
  }
  type User = Name & { age: number  };
  
  ```

* **interface extends type**

  ```ts
  type Name = { 
    name: string; 
  }
  interface User extends Name { 
    age: number; 
  }
  ```

* **type extends interface**

  ```ts
  interface Name { 
    name: string; 
  }
  type User = Name & { 
    age: number; 
  }
  ```

  

#### 不同点

##### type 可以而 interface 不行

* type 可以声明基本类型别名，**联合类型**，元组等类型

  ```ts
  // 基本类型别名
  type Name = string
  
  // 联合类型
  interface Dog {
      wong();
  }
  interface Cat {
      miao();
  }
  
  type Pet = Dog | Cat
  
  // 具体定义数组每个位置的类型
  type PetList = [Dog, Pet]
  
  
  ```

  

##### interface 可以而 type 不行

* interface能够声明合并

  ```ts
  interface User {
    name: string
    age: number
  }
  
  interface User {
    sex: string
  }
  
  /*
  User 接口为 {
    name: string
    age: number
    sex: string 
  }
  */
  
  ```

  