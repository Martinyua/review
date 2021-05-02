### Object

**Object.keys(obj)** —— 返回一个包含该对象所有的键的**字符串数组。**
**Object.values(obj)** ——成员是参数对象自身的（**不含继承的**）所有**可遍历**属性的**键值**
**Object.entries(obj)** —— 返回一个数组，成员是参数对象自身的（不含继承的）所有**可遍历**属性的**键值对数组**

```js
let obj={name:"小白",age:18,sex:"男"}
let newobj=Object.entries(obj)
console.log(newobj)//[["name", "小白"],["age", 18],["sex", "男"]]
```

