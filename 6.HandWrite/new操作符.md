<!--
 * @Author: Martin
 * @Date: 2021-03-02 18:59:47
 * @LastEditTime: 2021-03-26 13:34:32
 * @FilePath: \6.HandWrite\new操作符.md
-->
# 1. 模拟new的过程

实现步骤

1. 创建一个新的对象obj
2. 链接到原型（新对象的原型指向要继承的构造函数的原型），obj可以访问构造函数原型的属性
3. 绑定this实现继承，obj可以访问构造函数的属性
4. 如果构造函数返回的是对象则返回它，如果不是则返回obj

```
function Animals(name, color){
    this.name = name
} 

Animals.prototype.action = function () {
  console.log(this.name, 'walk')
复制代码
```

首先定义一个构造函数，以及他原型的方法
 接着实现一个`create`方法来模拟new

```
function create(constructor, ...args){
    const obj = new Object()
    obj.__proto__ = constructor.prototype
    const res = constructor.apply(obj, args)
    return res instanceof Object ? res : obj
}
复制代码
```

具体使用则：

```
const dog = create(Animals, 'dog', 'red')

// const cat = new Animals('cat', 'yellow')
复制代码
```

> 通过改变一个对象的 [[Prototype]] 属性来改变和继承属性会对性能造成非常严重的影响，并且性能消耗的时间也不是简单的花费在 obj.**proto** = ... 语句上, 它还会影响到所有继承自该 [[Prototype]] 的对象，如果你关心性能，你就不应该修改一个对象的 [[Prototype]]。

所以我们可以通过别的方法来改变obj原型的指向，通过`Object.create()`方法来继承

```js

function create(constructor, ...args) {
  const obj = Object.create(constructor.prototype)
  const res = constructor.apply(obj, args)
  return res instanceof Object ? res : obj
}
```


```js
function create(constructor,...args){
  const obj = Object.create(constructor.prototype)
  let res = constructor.apply(obj,args)
  return res instanceOf Object ? res  : obj
}
```








1. 创建一个新的对象`obj`
2. 连接到原型（新对象的原型指向要继承的构造函数的原型），`obj`可以访问构造函数原型的属性
3. 绑定this实现继承，`obj`可以访问构造函数的属性
4. 如果构造函数返回的是对象则返回他，如果不是则返回`obj`

```
function create(constructor,...args){
    const obj = new Object()
    obj.__proto__=constructor.prototype
    const res = constructor.apply(obj,args)
    return res instanceof Object ? res ： obj
}
```

