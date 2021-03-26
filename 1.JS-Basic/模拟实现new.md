1. 创建一个新的对象`obj`
2. 连接到原型（新对象的原型指向要继承的构造函数的原型），`obj`可以访问构造函数原型的属性
3. 绑定this实现继承，`obj`可以访问构造函数的属性
4. 如果构造函数返回的是对象则返回他，如果不是则返回`obj`

```
function create(constructor,...args){
    const obj.prototype = Object.create(constructor.prototype)
    const res = constructor.apply(obj,args)
    return res instanceof Object ? res ： obj
}
```

