<!--
 * @Author: Martin
 * @Date: 2021-03-02 17:20:06
 * @LastEditTime: 2021-03-26 13:05:23
 * @FilePath: \6.HandWrite\instanceof.md
-->
```js
function myInstanceof(left, right) {
    //基本数据类型直接返回false
    if(typeof left !== 'object' || left === null) return false;
    //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left);
    while(proto) {
        //查找到尽头，还没找到
        if(proto == null) return false;
        //找到相同的原型对象
        if(proto == right.prototype) return true;
        proto = Object.getPrototypeof(proto);
    }
}
function myInstanceof(left,right) {
    if(typeof left !== 'object' || left ===null) return false
     let proto = Object.getPrototypeOf(left)
     while(proto) {
         if(proto === right.prototype ) return true
         proto = Object.getPrototypeOf(proto)
     }
     return false

}
```

