### 为什么要typeScript

* TS对应JS的改进主要是静态类型检查，静态类型更有利于构建大型应用
  * **便于查错**，一旦代码发生类型不匹配，语言在编译阶段即可发现
  * 对于阅读代码友好。针对大型应用，方法众多，调用关系复杂，不可能每个函数都有人编写细致的文档，所以静态类型就是非常重要的**提示和约束。**
  * `VSCode` 会给你自动提示支持的参数和类型等

  ### interface VS type

https://zhuanlan.zhihu.com/p/351213183

#### 区别

几乎所有的接口功能都可以在类型中使用。

但是也有一些区别

* interface不能定义基本类型别名

* 接口是通过继承的方式来拓展。类型别名是通过 & 来拓展![img](https://pic3.zhimg.com/80/v2-b1082bbb757c1373cf1b0649185ea07e_720w.jpg)

* 接口可以自动合并，而类型别名不行

  ![img](https://pic2.zhimg.com/80/v2-56b037e6e20c2263382dc00bd86730c1_720w.jpg)



#### 什么时候用interface，type

意思是说能用 interface 的地方就用 interface，否则用 type，其实这个解释官方说的也比较明确，这样使用的原因是因为更贴合 JavaScript 对象的工作方式，再清晰一些，如果我们是定义一个 object，那么最好是使用 interface 去做类型声明，什么时候用 type 呢，当定义一个 function 的时候，用 type 会更好一些。

interface是接口，type是类型，本身就是两个概念。只是碰巧表现上比较相似。
希望定义一个变量类型，就用type，如果希望是能够**继承并约束**的，就用interface。
如果你不知道该用哪个，说明你只是想定义一个类型而非接口，所以应该用type。

### 泛型和any

看下面这个TypeScript函数：

```javascript
function identity(arg: any): any {
    return arg;
}
```

虽然使用any类型后这个函数已经能接收任何类型的arg参数，但是却丢失了一些信息：**传入的类型与返回的类型应该是相同的**。 通过any类型，无法实现这个约束。

因此，需要一种方法使返回值的类型与传入参数的类型是相同的。 这里，我们使用了**类型变量**，它是一种特殊的变量，只用于表示类型而不是值。

```javascript
function identity<T>(arg: T): T {
    return arg;
}
```

