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